import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, CalendarRange, ShieldCheck, Wrench, Sparkles } from 'lucide-react'
import { CARS, CATEGORIES } from '../../data/cars.js'
import CarCard from './CarCard.jsx'
import './Home.css'

export default function Home() {
  const navigate = useNavigate()
  const [active, setActive] = useState('all')
  const [where, setWhere] = useState('')

  const cars = useMemo(
    () => (active === 'all' ? CARS : CARS.filter((c) => c.category === active)),
    [active]
  )

  const submitSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (where) params.set('ville', where)
    if (active !== 'all') params.set('cat', active)
    navigate(`/recherche?${params.toString()}`)
  }

  return (
    <div className="home">
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__beam" aria-hidden="true" />
        <div className="container hero__inner">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Super &amp; hypercars · Particuliers et professionnels vérifiés
          </motion.p>
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            La voiture de vos rêves,<br />à portée de clic.
          </motion.h1>
          <p className="hero__lead text-muted">
            Trouvez près de chez vous la machine que vous cherchez, aux dates que vous voulez.
            Chaque véhicule a une histoire. Choisissez la vôtre.
          </p>

          <motion.form
            className="searchbar"
            onSubmit={submitSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <label className="searchbar__field">
              <MapPin size={18} aria-hidden="true" />
              <span className="searchbar__inputwrap">
                <span className="searchbar__label">Où</span>
                <input
                  type="text"
                  placeholder="Paris, Monaco, Genève…"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  aria-label="Ville de prise en charge"
                />
              </span>
            </label>
            <span className="searchbar__sep" />
            <label className="searchbar__field">
              <CalendarRange size={18} aria-hidden="true" />
              <span className="searchbar__inputwrap">
                <span className="searchbar__label">Quand</span>
                <input type="date" aria-label="Dates de location" />
              </span>
            </label>
            <button type="submit" className="btn btn--primary searchbar__submit">
              <Search size={18} aria-hidden="true" />
              <span>Rechercher</span>
            </button>
          </motion.form>

          <ul className="hero__trust">
            <li><ShieldCheck size={15} aria-hidden="true" /> Identité &amp; solvabilité vérifiées</li>
            <li><Sparkles size={15} aria-hidden="true" /> Réservation en un clic</li>
            <li><Wrench size={15} aria-hidden="true" /> Écosystème de pros partenaires</li>
          </ul>
        </div>
      </section>

      {/* ---------- CATÉGORIES ---------- */}
      <section className="container section">
        <div className="cats" role="tablist" aria-label="Catégories de véhicules">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={active === cat.id}
              className={`cats__chip ${active === cat.id ? 'is-active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ---------- FLOTTE ---------- */}
      <section className="container section">
        <div className="section__head">
          <h2 className="section__title">À découvrir près de vous</h2>
          <p className="text-muted">{cars.length} véhicules d’exception disponibles</p>
        </div>
        <div className="grid">
          {cars.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      </section>

      {/* ---------- DEVENIR HÔTE ---------- */}
      <section className="container section">
        <div className="hostcta">
          <div className="hostcta__text">
            <p className="eyebrow">Propriétaires &amp; loueurs professionnels</p>
            <h2 className="hostcta__title">Votre flotte mérite mieux qu’un tableur.</h2>
            <p className="text-muted">
              Disponibilités, plannings de départ/arrivée, immobilisations garage, options et
              conditions, paiements, acomptes, facturation et suivi des frais — pilotez tout depuis
              un seul tableau de bord. Le tracking véhicule est disponible en option Premium.
            </p>
            <button className="btn btn--primary" onClick={() => navigate('/pro')}>
              Découvrir l’espace pro
            </button>
          </div>
          <div className="hostcta__art" aria-hidden="true">
            <div className="hostcta__glow" />
          </div>
        </div>
      </section>
    </div>
  )
}
