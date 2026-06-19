/*
  Amorce de démonstration : garantit qu'il existe au moins une location complète
  (utilisateur vérifié + réservation + dossier documentaire) pour que l'espace
  loueur affiche de vrais documents téléchargeables dès le premier lancement.
*/
import { nanoid } from 'nanoid'
import { store, getCarById } from './store.js'
import { createDeposit, authorizeCaution } from './services/payments.js'
import { generateForBooking } from './services/documents.js'

const DAY = 86400000

export async function seedDemo() {
  const existing = await store.bookings.all()
  if (existing.length) return

  let user = await store.users.findByEmail('client.demo@asphalt.app')
  if (!user) user = await store.users.create({ email: 'client.demo@asphalt.app', fullName: 'Camille Durand' })
  await store.users.setKyc(user.id, 'verified')

  const car = getCarById('rs3-berline-9k') ?? getCarById('sto-furia')
  const start = new Date(Date.now() + 5 * DAY).toISOString().slice(0, 10)
  const end = new Date(Date.now() + 8 * DAY).toISOString().slice(0, 10)
  const days = 3
  const subtotal = car.pricePerDay * days
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee
  const q = { days, subtotal, serviceFee, total, deposit: Math.round(total * 0.3) }

  const deposit = await createDeposit({ amountEur: q.deposit, bookingId: 'seed', customerId: user.id })
  const caution = await authorizeCaution({ amountEur: car.deposit, bookingId: 'seed', customerId: user.id })

  const booking = {
    id: nanoid(10),
    carId: car.id, userId: user.id, start, end,
    renterName: user.fullName,
    status: 'confirmed',
    quote: q,
    payments: { deposit, caution, extras: [] },
    createdAt: Date.now(),
  }
  await store.bookings.create(booking)
  await generateForBooking(booking)
}
