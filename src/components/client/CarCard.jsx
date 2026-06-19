import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Gauge, Users, Zap, BadgeCheck } from 'lucide-react'
import CarVisual from '../CarVisual.jsx'
import { formatEUR, getCover } from '../../data/cars.js'
import './CarCard.css'

export default function CarCard({ car, index = 0 }) {
  return (
    <motion.article
      className="card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.06 }}
    >
      <Link to={`/vehicule/${car.id}`} className="card__link">
        <div className="card__media">
          <CarVisual accent={car.accent} src={getCover(car)} label={`${car.brand} ${car.model}`} />
          {car.instantBook && (
            <span className="card__instant">
              <Zap size={12} aria-hidden="true" /> Réservation immédiate
            </span>
          )}
          <span className="card__price">
            <strong className="tabular">{formatEUR(car.pricePerDay)}</strong> / jour
          </span>
        </div>

        <div className="card__body">
          <div className="card__head">
            <div>
              <p className="card__brand">{car.brand}</p>
              <h3 className="card__model">{car.model}</h3>
            </div>
            <span className="card__rating tabular">
              <Star size={13} aria-hidden="true" /> {car.rating.toFixed(2)}
            </span>
          </div>

          <p className="card__tagline">{car.tagline}</p>

          <div className="card__meta">
            <span><Gauge size={14} aria-hidden="true" /> {car.power} ch</span>
            <span><Users size={14} aria-hidden="true" /> {car.seats} pl.</span>
            <span className="card__city">{car.city}</span>
          </div>

          <div className="card__owner">
            {car.owner.verified && <BadgeCheck size={14} className="card__verified" aria-hidden="true" />}
            <span className="text-muted">{car.owner.name}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
