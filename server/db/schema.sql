-- ASPHALT — schéma PostgreSQL.
-- Idempotent : peut être rejoué sans casser une base existante.

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  full_name   TEXT,
  kyc_status  TEXT NOT NULL DEFAULT 'none',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kyc_sessions (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status      TEXT NOT NULL DEFAULT 'pending',
  documents   JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id           TEXT PRIMARY KEY,
  car_id       TEXT NOT NULL,
  user_id      TEXT REFERENCES users(id) ON DELETE SET NULL,
  renter_name  TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  quote        JSONB NOT NULL DEFAULT '{}'::jsonb,
  payments     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- évolution de schéma (base déjà existante) :
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS renter_name TEXT;

CREATE INDEX IF NOT EXISTS bookings_car_idx ON bookings(car_id);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings(user_id);

-- Indisponibilités posées par le loueur (garage, entretien, usage perso).
CREATE TABLE IF NOT EXISTS availability_blocks (
  car_id  TEXT NOT NULL,
  day     DATE NOT NULL,
  PRIMARY KEY (car_id, day)
);

-- Documents générés par location (contrat, assurance, carte grise, conditions).
CREATE TABLE IF NOT EXISTS documents (
  id          TEXT PRIMARY KEY,
  booking_id  TEXT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL,
  title       TEXT NOT NULL,
  filename    TEXT NOT NULL,
  audience    TEXT NOT NULL DEFAULT 'both',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS documents_booking_idx ON documents(booking_id);

CREATE TABLE IF NOT EXISTS messages (
  id          TEXT PRIMARY KEY,
  thread_id   TEXT NOT NULL,
  sender      TEXT NOT NULL,
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_thread_idx ON messages(thread_id);

CREATE TABLE IF NOT EXISTS partner_applications (
  id          TEXT PRIMARY KEY,
  kind        TEXT,
  company     TEXT,
  payload     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
