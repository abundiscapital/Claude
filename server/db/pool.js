/*
  Connexion PostgreSQL.
  Architecture mock-to-live, cohérente avec payments/kyc : sans DATABASE_URL,
  `dbEnabled` est faux et l'application bascule sur le store en mémoire (démo).
  Avec DATABASE_URL, on parle à une vraie base Postgres — aucun autre changement.
*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const dbEnabled = Boolean(process.env.DATABASE_URL)
export const dbMode = dbEnabled ? 'postgres' : 'memory'

export const pool = dbEnabled
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
    })
  : null

export async function query(text, params) {
  if (!pool) throw new Error('PostgreSQL non configuré (DATABASE_URL absente)')
  return pool.query(text, params)
}

/** Applique le schéma au démarrage (idempotent). */
export async function migrate() {
  if (!pool) return
  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  await pool.query(sql)
}
