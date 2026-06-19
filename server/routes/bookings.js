/* Réservations : devis, création, acompte + caution, refacturation, documents. */
import { Router } from 'express'
import { nanoid } from 'nanoid'
import { store, getCarById } from '../store.js'
import {
  createDeposit, authorizeCaution, releaseCaution, chargeExtra, paymentsMode,
} from '../services/payments.js'
import { generateForBooking, filePath } from '../services/documents.js'

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
  Crée la réservation : exige un utilisateur vérifié (KYC), prélève l'acompte,
  pose l'empreinte de caution, puis génère le dossier documentaire complet
  (contrat, assurance, carte grise, conditions).
*/
router.post('/', async (req, res) => {
  const { carId, userId, start, end, paymentMethodId } = req.body ?? {}
  const car = getCarById(carId)
  const user = await store.users.get(userId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  if (!user) return res.status(404).json({ error: 'utilisateur introuvable' })
  if (user.kycStatus !== 'verified') {
    return res.status(403).json({ error: 'dossier non vérifié', kycStatus: user.kycStatus })
  }

  const q = quote(car, start, end)
  const deposit = await createDeposit({ amountEur: q.deposit, bookingId: 'pending', customerId: user.id })
  const caution = await authorizeCaution({ amountEur: car.deposit, bookingId: 'pending', customerId: user.id, paymentMethodId })

  const booking = {
    id: nanoid(10),
    carId, userId, start, end,
    renterName: user.fullName ?? user.email,
    status: car.instantBook ? 'confirmed' : 'pending',
    quote: q,
    payments: { deposit, caution, extras: [] },
    createdAt: Date.now(),
  }
  await store.bookings.create(booking)

  // Dossier documentaire : visible au loueur, transmis au locataire.
  let documents = []
  try {
    documents = await generateForBooking(booking)
  } catch (e) {
    console.error('génération documents:', e.message)
  }

  res.status(201).json({ booking, documents, paymentsMode })
})

/** Liste des réservations (espace loueur) enrichies du véhicule. */
router.get('/', async (req, res) => {
  const list = await store.bookings.all()
  const bookings = list.map((b) => {
    const car = getCarById(b.carId)
    return { ...b, car: car ? { id: car.id, brand: car.brand, model: car.model, year: car.year } : null }
  })
  res.json({ bookings })
})

router.get('/:id', async (req, res) => {
  const b = await store.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  res.json({ booking: b })
})

/** Liste des documents générés pour une réservation. */
router.get('/:id/documents', async (req, res) => {
  const b = await store.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  let docs = await store.documents.listByBooking(b.id)
  if (!docs.length) {
    try { docs = await generateForBooking(b) } catch { /* noop */ }
  }
  res.json({ bookingId: b.id, documents: docs })
})

/** Téléchargement d'un document (PDF). */
router.get('/documents/:docId/download', async (req, res) => {
  const doc = await store.documents.get(req.params.docId)
  if (!doc) return res.status(404).json({ error: 'document introuvable' })
  res.download(filePath(doc.filename), `${doc.title}.pdf`)
})

/** Refacturation d'un frais ultérieur (carburant, péage, dommage). */
router.post('/:id/charge-extra', async (req, res) => {
  const b = await store.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  const { amountEur, reason, paymentMethodId } = req.body ?? {}
  if (!amountEur || !reason) return res.status(400).json({ error: 'montant et motif requis' })
  const charge = await chargeExtra({ amountEur, reason, bookingId: b.id, customerId: b.userId, paymentMethodId })
  b.payments.extras = [...(b.payments.extras ?? []), charge]
  await store.bookings.save(b)
  res.json({ booking: b, charge })
})

/** Clôture : libère la caution si aucun dommage. */
router.post('/:id/close', async (req, res) => {
  const b = await store.bookings.get(req.params.id)
  if (!b) return res.status(404).json({ error: 'réservation introuvable' })
  const released = await releaseCaution(b.payments.caution.id)
  b.status = 'completed'
  b.payments.caution.released = released.status
  await store.bookings.save(b)
  res.json({ booking: b })
})

export default router
