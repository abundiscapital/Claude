import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, MapPin, Wrench, SprayCan, ShieldCheck, Store, PaintBucket, BadgeCheck, ArrowRight,
} from 'lucide-react'
import { PARTNER_TYPES, PARTNERS } from '../../data/ecosystem.js'
import PartnerOnboarding from './PartnerOnboarding.jsx'
import './Ecosystem.css'

const TYPE_ICON = {
  garage: Wrench,
  body: PaintBucket,
  clean: SprayCan,
  insurance: ShieldCheck,
  dealer: Store,
}

export default function Ecosystem() {
  const [type, setType] = useState('all')
  const [onboarding, setOnboarding] = useState(false)

  const partners = useMemo(
    () => (type === 'all' ? PARTNERS : PARTNERS.filter((p) => p.type === type)),
    [type]
  )

  return (
    <div className="eco">
      <section className="eco__hero">
        <div className="container">
          <p className="eyebrow">L’écosystème ASPHALT</p>
          <h1 className="eco__title">Toute la filière, réunie au même endroit.</h1>
          <p className="eco__lead text-muted">
            Garages, carrossiers, detailing, assurances, concessionnaires : les partenaires
            de confiance qui entretiennent, protègent et subliment chaque véhicule. Et qui
            permettent à ceux qui veulent se lancer de trouver tout ce dont ils ont besoin.
          </p>
          <button className="btn btn--primary" onClick={() => setOnboarding(true)}>
            Devenir partenaire <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="container section">
        <div className="cats" role="tablist" aria-label="Types de partenaires">
          {PARTNER_TYPES.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={type === t.id}
              className={`cats__chip ${type === t.id ? 'is-active' : ''}`}
              onClick={() => setType(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="eco__grid">
          {partners.map((p, i) => {
            const Icon = TYPE_ICON[p.type]
            return (
              <motion.article
                key={p.id}
                className="partner"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              >
                <div className="partner__head">
                  <span className="partner__icon"><Icon size={20} aria-hidden="true" /></span>
                  <span className="partner__rating tabular">
                    <Star size={13} aria-hidden="true" /> {p.rating.toFixed(1)}
                  </span>
                </div>
                <h3 className="partner__name">
                  {p.name}
                  <BadgeCheck size={15} className="partner__verified" aria-hidden="true" />
                </h3>
                <p className="partner__city text-muted"><MapPin size={13} aria-hidden="true" /> {p.city}</p>
                <p className="partner__blurb text-muted">{p.blurb}</p>
                <ul className="partner__services">
                  {p.services.map((s) => (
                    <li key={s} className="pill">{s}</li>
                  ))}
                </ul>
                <p className="partner__jobs text-muted tabular">{p.jobs} interventions réalisées</p>
              </motion.article>
            )
          })}
        </div>
      </section>

      <AnimatePresence>
        {onboarding && <PartnerOnboarding onClose={() => setOnboarding(false)} />}
      </AnimatePresence>
    </div>
  )
}
