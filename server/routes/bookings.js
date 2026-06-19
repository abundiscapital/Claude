/* Réservations : devis, création, acompte + caution, refacturation de frais. */
import { Router } from 'express'
import { nanoid } from 'nanoid'
import { db, getCarById } from '../store.js'
import {
  createDeposit, authorizeCaution, releaseCaution, chargeExtra, paymentsMode,
} from '../services/payments.js'

const router = Router()
const DAY = 86400000

function quote(car, start, end) {
  const days = Math.max(1, Math.round((new Date(end) - new Date(start)) / DAY))
  const subtotal = car.pricePerDay * days
  const serviceFee = Math.round(subtotal * 0.1)
  return { days, subtotal, serviceFee, total: subtotal + serviceFee, deposit: Math.round((subtotal + serviceFee) * 0.3) }
}

/** Devis sans engagement. */
router.post('/quote', (req, res) => {
  const { carId, start, end } = req.body ?? {}
  const car = getCarById(carId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  if (!start || !end) return res.status(400).json({ error: 'dates requises' })
  res.json({ carId, ...quote(car, start, end), caution: car.deposit })
})

/**
  Crée la réservation : exige un utilisateur vérifié (KYC), prélève l'acompte et
  pose l'empreinte de caution. Reste "pending" tant que le loueur n'a pas accepté
  (sauf réservation immédiate).
*/
router.post('/', async (req, res) => {
  const { carId, userId, start, end, paymentMethodId } = req.body ?? {}
  const car = getCarById(carId)
  const user = db.users.get(userId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  if (!user) return res.status(404).json({ error: 'utilisateur introuvable' })
  if (user.kycStatus !== 'verified') {
    return res.status(403).json({ error: 'dossier non vérifié', kycStatus: user.kycStatus })
  }

  const q = quote(car, start, end)
  const deposit = await createDeposit({
    amountEur: q.deposit, bookingId: 'pending', customerId: user.id,
  })
  const caution = await authorizeCaution({
    amountEur: car.deposit, bookingId: 'pending', customerId: user.id, paymentMethodId,
  })

  const booking = {
    id: nanoid(10),
    carId, userId, start, end,
    status: car.instantBook ? 'confirmed' : 'pending',
    quote: q,
    payments: { deposit, caution, extras: [] },
    createdAt: Date.now(),
  }
  db.bookings.set(booking.id, booking)
  res.status(201).json({ booking, paymentsMode })
})

router.get('/:id', (req, res) => {
  const b = db.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  res.json({ booking: b })
})

/** Refacturation d'un frais ultérieur (carburant, péage, dommage). */
router.post('/:id/charge-extra', async (req, res) => {
  const b = db.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  const { amountEur, reason, paymentMethodId } = req.body ?? {}
  if (!amountEur || !reason) return res.status(400).json({ error: 'montant et motif requis' })
  const charge = await chargeExtra({
    amountEur, reason, bookingId: b.id, customerId: b.userId, paymentMethodId,
  })
  b.payments.extras.push(charge)
  res.json({ booking: b, charge })
})

/** Clôture : libère la caution si aucun dommage. */
router.post('/:id/close', async (req, res) => {
  const b = db.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  const released = await releaseCaution(b.payments.caution.id)
  b.status = 'completed'
  b.payments.caution.released = released.status
  res.json({ booking: b })
})

export default router
