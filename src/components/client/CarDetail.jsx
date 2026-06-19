import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Gauge, Users, Timer, Wind, Weight, BadgeCheck, Check, ShieldCheck,
} from 'lucide-react'
import { getCar, formatEUR } from '../../data/cars.js'
import CarVisual from '../CarVisual.jsx'
import KycGate from '../auth/KycGate.jsx'
import './CarDetail.css'

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = getCar(id)
  const [days, setDays] = useState(2)
  const [gateOpen, setGateOpen] = useState(false)

  if (!car) {
    return (
      <div className="container section empty">
        <h2>Véhicule introuvable</h2>
        <Link to="/" className="btn btn--primary">Retour à l’accueil</Link>
      </div>
    )
  }

  const subtotal = car.pricePerDay * days
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee

  return (
    <div className="detail">
      <div className="container">
        <Link to="/" className="backlink">
          <ArrowLeft size={16} aria-hidden="true" /> Toute la flotte
        </Link>

        <header className="detail__head">
          <div>
            <p className="card__brand">{car.brand} · {car.year}</p>
            <h1 className="detail__title">{car.model}</h1>
            <p className="detail__tagline">{car.tagline}</p>
          </div>
          <span className="detail__rating tabular">
            <Star size={16} aria-hidden="true" /> {car.rating.toFixed(2)}
            <span className="text-muted">({car.reviews} avis)</span>
          </span>
        </header>

        <motion.div
          className="detail__hero"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <CarVisual accent={car.accent} label={`${car.brand} ${car.model}`} eager />
        </motion.div>

        <div className="detail__layout">
          <div className="detail__main">
            <section className="detail__block">
              <h2 className="detail__h2">L’histoire</h2>
              <p className="detail__story">{car.story}</p>
            </section>

            <section className="detail__block">
              <h2 className="detail__h2">Performances</h2>
              <div className="specs">
                <Spec icon={Timer} label="0 → 100 km/h" value={car.specs['0-100']} />
                <Spec icon={Wind} label="Vitesse max" value={car.specs.vmax} />
                <Spec icon={Gauge} label="Puissance" value={`${car.power} ch`} />
                <Spec icon={Weight} label="Poids" value={car.specs.poids} />
                <Spec icon={Users} label="Places" value={`${car.seats}`} />
                <Spec icon={Gauge} label="Boîte" value={car.gearbox} />
              </div>
            </section>

            <section className="detail__block">
              <h2 className="detail__h2">Options &amp; conditions</h2>
              <ul className="options">
                {car.options.map((o) => (
                  <li key={o}><Check size={16} aria-hidden="true" /> {o}</li>
                ))}
              </ul>
            </section>

            <section className="detail__block detail__owner">
              {car.owner.verified && <BadgeCheck size={22} className="card__verified" aria-hidden="true" />}
              <div>
                <p className="detail__owner-name">{car.owner.name}</p>
                <p className="text-muted">
                  Loueur vérifié · {car.owner.fleet} véhicules sur ASPHALT
                </p>
              </div>
            </section>
          </div>

          {/* ---------- PANNEAU RÉSERVATION ---------- */}
          <aside className="booking">
            <div className="booking__price">
              <strong className="tabular">{formatEUR(car.pricePerDay)}</strong>
              <span className="text-muted"> / jour</span>
            </div>

            <label className="booking__row">
              <span>Durée</span>
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                {[1, 2, 3, 4, 5, 7, 10, 14].map((d) => (
                  <option key={d} value={d}>{d} jour{d > 1 ? 's' : ''}</option>
                ))}
              </select>
            </label>

            <dl className="booking__lines">
              <div>
                <dt className="text-muted">{formatEUR(car.pricePerDay)} × {days} j</dt>
                <dd className="tabular">{formatEUR(subtotal)}</dd>
              </div>
              <div>
                <dt className="text-muted">Frais de service</dt>
                <dd className="tabular">{formatEUR(serviceFee)}</dd>
              </div>
              <div className="booking__total">
                <dt>Total</dt>
                <dd className="tabular">{formatEUR(total)}</dd>
              </div>
            </dl>

            <p className="booking__deposit text-muted">
              <ShieldCheck size={14} aria-hidden="true" /> Caution {formatEUR(car.deposit)} ·
              acompte de 30 % pour bloquer la réservation
            </p>

            <button className="btn btn--primary btn--block" onClick={() => setGateOpen(true)}>
              {car.instantBook ? 'Réserver en un clic' : 'Demander à réserver'}
            </button>
            <p className="booking__note text-muted">
              Vous ne payez rien avant la vérification de votre dossier.
            </p>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {gateOpen && (
          <KycGate
            car={car}
            total={total}
            onClose={() => setGateOpen(false)}
            onComplete={() => {
              setGateOpen(false)
              navigate('/')
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="spec">
      <Icon size={18} className="spec__icon" aria-hidden="true" />
      <div>
        <p className="spec__value tabular">{value}</p>
        <p className="spec__label text-muted">{label}</p>
      </div>
    </div>
  )
}
