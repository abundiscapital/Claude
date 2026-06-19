import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutGrid, CarFront, CalendarClock, Wallet, FileText, MapPin, Crown,
  ArrowUpRight, PlaneTakeoff, PlaneLanding, Wrench, TrendingUp, Plus, Download,
  FileSignature, ShieldCheck, ScrollText, BookOpen,
} from 'lucide-react'
import { KPIS, FLEET, PLANNING, PAYMENTS, STATUS_LABEL } from '../../data/fleet.js'
import { formatEUR, getBookedRanges } from '../../data/cars.js'
import { api } from '../../api/client.js'
import AvailabilityCalendar from '../AvailabilityCalendar.jsx'
import './Dashboard.css'

const TABS = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutGrid },
  { id: 'fleet', label: 'Flotte', icon: CarFront },
  { id: 'planning', label: 'Planning', icon: CalendarClock },
  { id: 'payments', label: 'Paiements', icon: Wallet },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'tracking', label: 'Tracking', icon: MapPin, premium: true },
]

export default function Dashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="dash">
      <aside className="dash__side">
        <p className="dash__side-title eyebrow">Espace propriétaire</p>
        <nav className="dash__nav" aria-label="Sections du tableau de bord">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`dash__navitem ${tab === t.id ? 'is-active' : ''}`}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              <t.icon size={18} aria-hidden="true" />
              <span>{t.label}</span>
              {t.premium && <Crown size={13} className="dash__premium" aria-hidden="true" />}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dash__main">
        {tab === 'overview' && <Overview />}
        {tab === 'fleet' && <Fleet />}
        {tab === 'planning' && <Planning />}
        {tab === 'payments' && <Payments />}
        {tab === 'documents' && <Documents />}
        {tab === 'tracking' && <Tracking />}
      </main>
    </div>
  )
}

function PanelHead({ title, subtitle, action }) {
  return (
    <div className="dash__head">
      <div>
        <h1 className="dash__title">{title}</h1>
        {subtitle && <p className="text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function Overview() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PanelHead title="Bonsoir, Maranello Prestige" subtitle="Voici votre activité du jour." />
      <div className="kpis">
        {KPIS.map((k) => (
          <div key={k.id} className="kpi">
            <p className="kpi__label text-muted">{k.label}</p>
            <p className="kpi__value tabular">{k.value}</p>
            <p className={`kpi__delta kpi__delta--${k.trend}`}>
              {k.trend === 'up' && <TrendingUp size={13} aria-hidden="true" />}
              {k.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="dash__cols">
        <div className="panel">
          <h2 className="panel__title">Prochains mouvements</h2>
          <PlanningList items={PLANNING.slice(0, 3)} />
        </div>
        <div className="panel">
          <h2 className="panel__title">À valider</h2>
          <p className="text-muted dash__hint">
            3 demandes de réservation. 1 dossier locataire est complet et vérifié.
          </p>
          <button className="btn btn--primary">Examiner les demandes <ArrowUpRight size={16} aria-hidden="true" /></button>
        </div>
      </div>
    </motion.section>
  )
}

function Fleet() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PanelHead
        title="Ma flotte"
        subtitle={`${FLEET.length} véhicules`}
        action={<button className="btn btn--primary"><Plus size={16} aria-hidden="true" /> Ajouter un véhicule</button>}
      />
      <div className="table" role="table" aria-label="Flotte">
        <div className="table__row table__row--head" role="row">
          <span role="columnheader">Véhicule</span>
          <span role="columnheader">Immatriculation</span>
          <span role="columnheader">Tarif / jour</span>
          <span role="columnheader">Statut</span>
          <span role="columnheader">Prochain événement</span>
        </div>
        {FLEET.map((v) => (
          <div className="table__row" role="row" key={v.id}>
            <span className="table__strong" role="cell">{v.name}</span>
            <span className="text-muted tabular" role="cell">{v.plate}</span>
            <span className="tabular" role="cell">{formatEUR(v.price)}</span>
            <span role="cell"><StatusPill status={v.status} /></span>
            <span className="text-muted" role="cell">{v.nextEvent}</span>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

function Planning() {
  const [vehicle, setVehicle] = useState(FLEET[0].id)
  const [blocked, setBlocked] = useState(new Set())
  const booked = getBookedRanges(vehicle)

  const toggle = (isoDay) =>
    setBlocked((prev) => {
      const nextSet = new Set(prev)
      if (nextSet.has(isoDay)) nextSet.delete(isoDay)
      else nextSet.add(isoDay)
      return nextSet
    })

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PanelHead
        title="Planning & disponibilités"
        subtitle="Départs, retours et immobilisations (garage, vidanges, services)."
      />
      <div className="dash__cols dash__cols--planning">
        <div className="panel">
          <h2 className="panel__title">Mouvements à venir</h2>
          <PlanningList items={PLANNING} />
        </div>
        <div className="panel">
          <div className="planning__calhead">
            <h2 className="panel__title">Gérer les indisponibilités</h2>
            <select
              className="planning__select"
              value={vehicle}
              onChange={(e) => { setVehicle(e.target.value); setBlocked(new Set()) }}
              aria-label="Choisir un véhicule"
            >
              {FLEET.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <p className="text-muted planning__hint">
            Cliquez un jour libre pour le bloquer (garage, entretien, usage perso).
          </p>
          <AvailabilityCalendar
            mode="manage"
            booked={booked}
            blocked={blocked}
            onToggleBlock={toggle}
          />
          <p className="planning__count text-muted">
            {blocked.size} jour{blocked.size > 1 ? 's' : ''} bloqué{blocked.size > 1 ? 's' : ''} ·
            sauvegardé automatiquement
          </p>
        </div>
      </div>
    </motion.section>
  )
}

function PlanningList({ items }) {
  const icon = { departure: PlaneTakeoff, return: PlaneLanding, maintenance: Wrench }
  const label = { departure: 'Départ', return: 'Retour', maintenance: 'Immobilisation' }
  return (
    <ul className="timeline">
      {items.map((p) => {
        const Icon = icon[p.type]
        return (
          <li key={p.id} className={`timeline__item timeline__item--${p.type}`}>
            <span className="timeline__icon"><Icon size={16} aria-hidden="true" /></span>
            <div className="timeline__body">
              <p className="timeline__top">
                <strong>{p.car}</strong>
                <span className="pill">{label[p.type]}</span>
              </p>
              <p className="text-muted">{p.client} · {p.place}</p>
            </div>
            <span className="timeline__time text-muted">{p.time}</span>
          </li>
        )
      })}
    </ul>
  )
}

function Payments() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PanelHead
        title="Paiements & facturation"
        subtitle="Acomptes, soldes et frais ultérieurs (carburant, péages, dommages)."
        action={<button className="btn btn--ghost"><Download size={16} aria-hidden="true" /> Exporter</button>}
      />
      <div className="table" role="table" aria-label="Paiements">
        <div className="table__row table__row--head table__row--pay" role="row">
          <span role="columnheader">Facture</span>
          <span role="columnheader">Client</span>
          <span role="columnheader">Véhicule</span>
          <span role="columnheader">Type</span>
          <span role="columnheader">Montant</span>
          <span role="columnheader">Statut</span>
        </div>
        {PAYMENTS.map((p) => (
          <div className="table__row table__row--pay" role="row" key={p.id}>
            <span className="table__strong tabular" role="cell">{p.id}</span>
            <span role="cell">{p.client}</span>
            <span className="text-muted" role="cell">{p.car}</span>
            <span className="text-muted" role="cell">{p.kind}</span>
            <span className="tabular" role="cell">{formatEUR(p.amount)}</span>
            <span role="cell"><StatusPill status={p.status} /></span>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

const DOC_ICON = {
  contract: FileSignature,
  insurance: ShieldCheck,
  registration: ScrollText,
  terms: BookOpen,
}
const fmtDay = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

function Documents() {
  const [bookings, setBookings] = useState(null) // null = chargement, [] = vide/hors-ligne
  const [docsByBooking, setDocsByBooking] = useState({})

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const { bookings: list } = await api.bookings()
        if (!alive) return
        setBookings(list)
        const entries = await Promise.all(
          list.map(async (b) => {
            try {
              const { documents } = await api.documents(b.id)
              return [b.id, documents]
            } catch {
              return [b.id, []]
            }
          }),
        )
        if (alive) setDocsByBooking(Object.fromEntries(entries))
      } catch {
        if (alive) setBookings([]) // API absente → mode démo
      }
    })()
    return () => { alive = false }
  }, [])

  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PanelHead
        title="Documentation"
        subtitle="Le dossier complet de chaque location : contrat, assurance, carte grise et conditions — généré automatiquement, transmis au locataire."
      />

      {bookings === null && <p className="text-muted">Chargement des dossiers…</p>}

      {bookings && bookings.length > 0 && (
        <div className="dossiers">
          {bookings.map((b) => {
            const docs = docsByBooking[b.id] ?? []
            return (
              <article className="dossier" key={b.id}>
                <header className="dossier__head">
                  <div>
                    <p className="dossier__car">
                      {b.car ? `${b.car.brand} ${b.car.model}` : b.carId}
                      <span className={`status status--${b.status}`}>{STATUS_LABEL[b.status] ?? b.status}</span>
                    </p>
                    <p className="text-muted">
                      {b.renterName ?? 'Locataire'} · du {fmtDay(b.start)} au {fmtDay(b.end)} · réf. {b.id.toUpperCase()}
                    </p>
                  </div>
                </header>
                <div className="dossier__docs">
                  {docs.map((d) => {
                    const Icon = DOC_ICON[d.kind] ?? FileText
                    return (
                      <a
                        key={d.id}
                        className="dossier__doc"
                        href={api.documentUrl(d.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon size={18} aria-hidden="true" />
                        <span className="dossier__doc-title">{d.title}</span>
                        <Download size={15} className="dossier__doc-dl" aria-hidden="true" />
                      </a>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {bookings && bookings.length === 0 && (
        <>
          <p className="text-muted dash__hint">
            Lancez l’API (<code>npm run server</code>) pour générer et télécharger les vrais
            documents. Types produits pour chaque location :
          </p>
          <div className="docgrid">
            {[
              ['Contrat de location', FileSignature],
              ['Attestation d’assurance', ShieldCheck],
              ['Carte grise (copie)', ScrollText],
              ['Conditions générales', BookOpen],
            ].map(([d, Icon]) => (
              <div className="doccard" key={d}>
                <Icon size={20} aria-hidden="true" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.section>
  )
}

function Tracking() {
  return (
    <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PanelHead title="Tracking véhicules" subtitle="Géolocalisation temps réel & géo-restrictions." />
      <div className="premium">
        <Crown size={28} className="premium__crown" aria-hidden="true" />
        <h2 className="premium__title">Fonctionnalité Premium</h2>
        <p className="text-muted">
          Suivez vos véhicules en temps réel, définissez des zones autorisées, recevez des
          alertes de vitesse et retrouvez instantanément une voiture en cas d’incident.
          Disponible avec l’abonnement <strong>ASPHALT Pro+</strong>.
        </p>
        <button className="btn btn--primary">Activer le tracking <ArrowUpRight size={16} aria-hidden="true" /></button>
      </div>
    </motion.section>
  )
}

function StatusPill({ status }) {
  return <span className={`status status--${status}`}>{STATUS_LABEL[status]}</span>
}
