import { useMemo, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Gauge, Users, Timer, Wind, Weight, BadgeCheck, Check, ShieldCheck,
  CalendarRange, MessageCircle,
} from 'lucide-react'
import { getCar, getGallery, getBookedRanges, formatEUR } from '../../data/cars.js'
import PhotoGallery from './PhotoGallery.jsx'
import AvailabilityCalendar from '../AvailabilityCalendar.jsx'
import KycGate from '../auth/KycGate.jsx'
import './CarDetail.css'

const DAY = 86400000
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = getCar(id)
  const [range, setRange] = useState({ start: null, end: null })
  const [gateOpen, setGateOpen] = useState(false)

  const gallery = useMemo(() => (car ? getGallery(car) : []), [car])
  const booked = useMemo(() => (car ? getBookedRanges(car.id) : []), [car])

  if (!car) {
    return (
      <div className="container section empty">
        <h2>Véhicule introuvable</h2>
        <Link to="/" className="btn btn--primary">Retour à l’accueil</Link>
      </div>
    )
  }

  const days =
    range.start && range.end
      ? Math.max(1, Math.round((new Date(range.end) - new Date(range.start)) / DAY))
      : 0
  const subtotal = car.pricePerDay * days
  const serviceFee = Math.round(subtotal * 0.1)
  const total = subtotal + serviceFee
  const ready = days > 0

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
          className="detail__gallery"
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <PhotoGallery views={gallery} label={`${car.brand} ${car.model}`} />
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

            <section className="detail__block">
              <h2 className="detail__h2">
                <CalendarRange size={20} aria-hidden="true" /> Disponibilités
              </h2>
              <p className="text-muted detail__cal-hint">
                Sélectionnez vos dates. Les jours barrés sont déjà réservés.
              </p>
              <AvailabilityCalendar
                mode="select"
                booked={booked}
                range={range}
                onRangeChange={setRange}
              />
            </section>

            <section className="detail__block detail__owner">
              {car.owner.verified && <BadgeCheck size={22} className="card__verified" aria-hidden="true" />}
              <div className="detail__owner-info">
                <p className="detail__owner-name">{car.owner.name}</p>
                <p className="text-muted">
                  Loueur vérifié · {car.owner.fleet} véhicules sur ASPHALT
                </p>
              </div>
              <Link to="/messages" className="btn btn--ghost detail__contact">
                <MessageCircle size={16} aria-hidden="true" /> Contacter
              </Link>
            </section>
          </div>

          {/* ---------- PANNEAU RÉSERVATION ---------- */}
          <aside className="booking">
            <div className="booking__price">
              <strong className="tabular">{formatEUR(car.pricePerDay)}</strong>
              <span className="text-muted"> / jour</span>
            </div>

            <div className="booking__dates">
              <div className={`booking__date ${range.start ? 'is-set' : ''}`}>
                <span className="text-muted">Début</span>
                <strong>{range.start ? fmtDate(range.start) : '—'}</strong>
              </div>
              <div className={`booking__date ${range.end ? 'is-set' : ''}`}>
                <span className="text-muted">Fin</span>
                <strong>{range.end ? fmtDate(range.end) : '—'}</strong>
              </div>
            </div>

            {ready ? (
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
            ) : (
              <p className="booking__pick text-muted">
                Choisissez vos dates dans le calendrier pour voir le tarif.
              </p>
            )}

            <p className="booking__deposit text-muted">
              <ShieldCheck size={14} aria-hidden="true" /> Caution {formatEUR(car.deposit)} ·
              acompte de 30 % pour bloquer la réservation
            </p>

            <button
              className="btn btn--primary btn--block"
              onClick={() => setGateOpen(true)}
              disabled={!ready}
            >
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
            range={range}
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
