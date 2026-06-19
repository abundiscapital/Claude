/*
  Store en mémoire (démo). En production : PostgreSQL + Prisma/Drizzle.
  Réutilise la flotte du front pour rester cohérent.
*/
import { CARS, getBookedRanges } from '../src/data/cars.js'

export const db = {
  users: new Map(),
  kycSessions: new Map(),
  bookings: new Map(),
  messages: [],
  // disponibilités : carId -> { booked: [{from,to}], blocked: Set<iso> }
  availability: new Map(),
}

// seed disponibilités
for (const car of CARS) {
  db.availability.set(car.id, {
    booked: getBookedRanges(car.id).map((r) => ({
      from: r.from.toISOString().slice(0, 10),
      to: r.to.toISOString().slice(0, 10),
    })),
    blocked: new Set(),
  })
}

export const cars = CARS
export const getCarById = (id) => CARS.find((c) => c.id === id)
