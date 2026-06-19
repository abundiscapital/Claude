/*
  Couche de persistance ASPHALT.

  Une seule interface asynchrone, deux implémentations :
   • PostgreSQL quand DATABASE_URL est présente (production) ;
   • Maps en mémoire sinon (démo, l'API tourne sans aucune dépendance).

  Les routes n'utilisent que `store.*` et restent agnostiques du backend.
*/
import { nanoid } from 'nanoid'
import { CARS, getBookedRanges } from '../src/data/cars.js'
import { dbEnabled, query } from './db/pool.js'

export const cars = CARS
export const getCarById = (id) => CARS.find((c) => c.id === id)

const iso = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10))

/* Plages réservées de démo (déterministes) pour amorcer les disponibilités. */
function seededBookedRanges(carId) {
  return getBookedRanges(carId).map((r) => ({ from: iso(r.from), to: iso(r.to) }))
}

/* ============================================================ MÉMOIRE === */
function memoryStore() {
  const users = new Map()
  const kyc = new Map()
  const bookings = new Map()
  const blocks = new Map() // carId -> Set<iso>
  const documents = new Map()
  const messages = [] // {id, threadId, sender, body, createdAt}
  const partners = []

  return {
    mode: 'memory',
    async init() {},

    users: {
      async findByEmail(email) {
        return [...users.values()].find((u) => u.email === email) ?? null
      },
      async get(id) {
        return users.get(id) ?? null
      },
      async create({ email, phone, fullName }) {
        const user = {
          id: nanoid(10), email, phone: phone ?? null, fullName: fullName ?? null,
          kycStatus: 'none', createdAt: Date.now(),
        }
        users.set(user.id, user)
        return user
      },
      async setKyc(id, status) {
        const u = users.get(id)
        if (u) u.kycStatus = status
        return u ?? null
      },
    },

    kyc: {
      async create(session) {
        kyc.set(session.id, session)
        return session
      },
      async get(id) {
        return kyc.get(id) ?? null
      },
      async save(session) {
        kyc.set(session.id, session)
        return session
      },
    },

    bookings: {
      async create(booking) {
        bookings.set(booking.id, booking)
        return booking
      },
      async get(id) {
        return bookings.get(id) ?? null
      },
      async save(booking) {
        bookings.set(booking.id, booking)
        return booking
      },
      async all() {
        return [...bookings.values()]
      },
    },

    availability: {
      async get(carId) {
        return {
          booked: seededBookedRanges(carId),
          blocked: [...(blocks.get(carId) ?? new Set())],
        }
      },
      async setBlock(carId, day, blocked) {
        const set = blocks.get(carId) ?? new Set()
        if (blocked) set.add(day)
        else set.delete(day)
        blocks.set(carId, set)
        return [...set]
      },
    },

    documents: {
      async create(doc) {
        documents.set(doc.id, doc)
        return doc
      },
      async get(id) {
        return documents.get(id) ?? null
      },
      async listByBooking(bookingId) {
        return [...documents.values()].filter((d) => d.bookingId === bookingId)
      },
    },

    messages: {
      async list(threadId) {
        return messages.filter((m) => m.threadId === threadId)
      },
      async add({ threadId, sender, body }) {
        const msg = { id: nanoid(10), threadId, sender, body, createdAt: Date.now() }
        messages.push(msg)
        return msg
      },
    },

    partners: {
      async apply(payload) {
        const row = { id: nanoid(10), ...payload, createdAt: Date.now() }
        partners.push(row)
        return row
      },
    },
  }
}

/* ========================================================== POSTGRES === */
function pgStore() {
  return {
    mode: 'postgres',
    async init() {
      // amorce les disponibilités réservées si la table est vide pour un véhicule
      // (les plages de démo restent calculées à la volée côté availability.get)
    },

    users: {
      async findByEmail(email) {
        const { rows } = await query('SELECT * FROM users WHERE email = $1', [email])
        return rows[0] ? mapUser(rows[0]) : null
      },
      async get(id) {
        const { rows } = await query('SELECT * FROM users WHERE id = $1', [id])
        return rows[0] ? mapUser(rows[0]) : null
      },
      async create({ email, phone, fullName }) {
        const id = nanoid(10)
        const { rows } = await query(
          `INSERT INTO users (id, email, phone, full_name, kyc_status)
           VALUES ($1, $2, $3, $4, 'none') RETURNING *`,
          [id, email, phone ?? null, fullName ?? null],
        )
        return mapUser(rows[0])
      },
      async setKyc(id, status) {
        const { rows } = await query(
          'UPDATE users SET kyc_status = $2 WHERE id = $1 RETURNING *',
          [id, status],
        )
        return rows[0] ? mapUser(rows[0]) : null
      },
    },

    kyc: {
      async create(session) {
        await query(
          `INSERT INTO kyc_sessions (id, user_id, status, documents)
           VALUES ($1, $2, $3, $4)`,
          [session.id, session.userId, session.status, JSON.stringify(session.documents ?? [])],
        )
        return session
      },
      async get(id) {
        const { rows } = await query('SELECT * FROM kyc_sessions WHERE id = $1', [id])
        return rows[0] ? mapKyc(rows[0]) : null
      },
      async save(session) {
        await query(
          `UPDATE kyc_sessions SET status = $2, documents = $3, updated_at = now()
           WHERE id = $1`,
          [session.id, session.status, JSON.stringify(session.documents ?? [])],
        )
        return session
      },
    },

    bookings: {
      async create(booking) {
        await query(
          `INSERT INTO bookings (id, car_id, user_id, renter_name, start_date, end_date, status, quote, payments)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            booking.id, booking.carId, booking.userId, booking.renterName ?? null,
            booking.start, booking.end,
            booking.status, JSON.stringify(booking.quote), JSON.stringify(booking.payments),
          ],
        )
        return booking
      },
      async get(id) {
        const { rows } = await query('SELECT * FROM bookings WHERE id = $1', [id])
        return rows[0] ? mapBooking(rows[0]) : null
      },
      async save(booking) {
        await query(
          `UPDATE bookings SET status = $2, quote = $3, payments = $4 WHERE id = $1`,
          [booking.id, booking.status, JSON.stringify(booking.quote), JSON.stringify(booking.payments)],
        )
        return booking
      },
      async all() {
        const { rows } = await query('SELECT * FROM bookings ORDER BY created_at DESC')
        return rows.map(mapBooking)
      },
    },

    availability: {
      async get(carId) {
        const { rows } = await query('SELECT day FROM availability_blocks WHERE car_id = $1', [carId])
        return {
          booked: seededBookedRanges(carId),
          blocked: rows.map((r) => iso(r.day)),
        }
      },
      async setBlock(carId, day, blocked) {
        if (blocked) {
          await query(
            `INSERT INTO availability_blocks (car_id, day) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [carId, day],
          )
        } else {
          await query('DELETE FROM availability_blocks WHERE car_id = $1 AND day = $2', [carId, day])
        }
        const { rows } = await query('SELECT day FROM availability_blocks WHERE car_id = $1', [carId])
        return rows.map((r) => iso(r.day))
      },
    },

    documents: {
      async create(doc) {
        await query(
          `INSERT INTO documents (id, booking_id, kind, title, filename, audience)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [doc.id, doc.bookingId, doc.kind, doc.title, doc.filename, doc.audience ?? 'both'],
        )
        return doc
      },
      async get(id) {
        const { rows } = await query('SELECT * FROM documents WHERE id = $1', [id])
        return rows[0] ? mapDoc(rows[0]) : null
      },
      async listByBooking(bookingId) {
        const { rows } = await query(
          'SELECT * FROM documents WHERE booking_id = $1 ORDER BY created_at', [bookingId],
        )
        return rows.map(mapDoc)
      },
    },

    messages: {
      async list(threadId) {
        const { rows } = await query(
          'SELECT * FROM messages WHERE thread_id = $1 ORDER BY created_at', [threadId],
        )
        return rows.map((r) => ({
          id: r.id, threadId: r.thread_id, sender: r.sender, body: r.body,
          createdAt: new Date(r.created_at).getTime(),
        }))
      },
      async add({ threadId, sender, body }) {
        const id = nanoid(10)
        const { rows } = await query(
          `INSERT INTO messages (id, thread_id, sender, body)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [id, threadId, sender, body],
        )
        const r = rows[0]
        return { id: r.id, threadId: r.thread_id, sender: r.sender, body: r.body, createdAt: new Date(r.created_at).getTime() }
      },
    },

    partners: {
      async apply(payload) {
        const id = nanoid(10)
        await query(
          `INSERT INTO partner_applications (id, kind, company, payload)
           VALUES ($1, $2, $3, $4)`,
          [id, payload.kind ?? null, payload.company ?? null, JSON.stringify(payload)],
        )
        return { id, ...payload }
      },
    },
  }
}

/* ----------------------------------------------------- mappers PG → JS */
const mapUser = (r) => ({
  id: r.id, email: r.email, phone: r.phone, fullName: r.full_name,
  kycStatus: r.kyc_status, createdAt: new Date(r.created_at).getTime(),
})
const mapKyc = (r) => ({
  id: r.id, userId: r.user_id, status: r.status,
  documents: r.documents ?? [], createdAt: new Date(r.created_at).getTime(),
})
const mapBooking = (r) => ({
  id: r.id, carId: r.car_id, userId: r.user_id, renterName: r.renter_name,
  start: iso(r.start_date), end: iso(r.end_date), status: r.status,
  quote: r.quote ?? {}, payments: r.payments ?? {}, createdAt: new Date(r.created_at).getTime(),
})
const mapDoc = (r) => ({
  id: r.id, bookingId: r.booking_id, kind: r.kind, title: r.title,
  filename: r.filename, audience: r.audience, createdAt: new Date(r.created_at).getTime(),
})

export const store = dbEnabled ? pgStore() : memoryStore()
