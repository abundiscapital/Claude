import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { isDayBooked } from '../data/cars.js'
import './AvailabilityCalendar.css'

/*
  Calendrier de disponibilités, sans dépendance.
  - mode "select" (client) : choisir une plage de location (début → fin).
  - mode "manage" (pro)    : cliquer un jour libre pour le bloquer/débloquer.
  `booked` = plages indisponibles [{from,to}]. `blocked` = set d'ISO (mode manage).
*/
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

const iso = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x.toISOString().slice(0, 10)
}
const sameOrAfter = (a, b) => iso(a) >= iso(b)

export default function AvailabilityCalendar({
  mode = 'select',
  booked = [],
  blocked = new Set(),
  range,
  onRangeChange,
  onToggleBlock,
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const firstDay = new Date(year, month, 1)
  const startWeekday = (firstDay.getDay() + 6) % 7 // lundi = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const isPast = (d) => iso(d) < iso(today)
  const isUnavailable = (d) => isDayBooked(d, booked) || blocked.has(iso(d))

  const inRange = (d) => {
    if (!range?.start || !range?.end) return false
    return iso(d) > iso(range.start) && iso(d) < iso(range.end)
  }
  const isEdge = (d) =>
    (range?.start && iso(d) === iso(range.start)) || (range?.end && iso(d) === iso(range.end))

  const handleClick = (d) => {
    if (isPast(d)) return
    if (mode === 'manage') {
      if (isDayBooked(d, booked)) return // une location ne se débloque pas ici
      onToggleBlock?.(iso(d))
      return
    }
    // mode select
    if (isUnavailable(d)) return
    if (!range?.start || (range.start && range.end)) {
      onRangeChange?.({ start: d, end: null })
    } else if (sameOrAfter(d, range.start)) {
      // refuse une plage qui chevauche une indisponibilité
      let cur = new Date(range.start)
      while (iso(cur) <= iso(d)) {
        if (isUnavailable(cur)) {
          onRangeChange?.({ start: d, end: null })
          return
        }
        cur = new Date(cur.getTime() + 86400000)
      }
      onRangeChange?.({ start: range.start, end: d })
    } else {
      onRangeChange?.({ start: d, end: null })
    }
  }

  const prevDisabled = year === today.getFullYear() && month === today.getMonth()

  return (
    <div className="cal">
      <div className="cal__head">
        <button
          className="cal__nav"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          disabled={prevDisabled}
          aria-label="Mois précédent"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <span className="cal__month">{MONTHS[month]} {year}</span>
        <button
          className="cal__nav"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          aria-label="Mois suivant"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="cal__grid cal__grid--head" aria-hidden="true">
        {DAYS.map((d, i) => (
          <span key={i} className="cal__dow">{d}</span>
        ))}
      </div>

      <div className="cal__grid">
        {cells.map((d, i) =>
          d ? (
            <button
              key={i}
              type="button"
              className={[
                'cal__day',
                isPast(d) && 'is-past',
                isUnavailable(d) && 'is-unavail',
                inRange(d) && 'is-inrange',
                isEdge(d) && 'is-edge',
                mode === 'manage' && blocked.has(iso(d)) && 'is-blocked',
              ].filter(Boolean).join(' ')}
              onClick={() => handleClick(d)}
              disabled={isPast(d) || (mode === 'select' && isUnavailable(d))}
              aria-label={`${d.getDate()} ${MONTHS[month]}${isUnavailable(d) ? ' — indisponible' : ''}`}
            >
              {d.getDate()}
            </button>
          ) : (
            <span key={i} className="cal__day cal__day--empty" />
          )
        )}
      </div>

      <ul className="cal__legend">
        <li><span className="dot dot--free" /> Disponible</li>
        <li><span className="dot dot--unavail" /> Indisponible</li>
        {mode === 'manage' && <li><span className="dot dot--blocked" /> Bloqué (vous)</li>}
        {mode === 'select' && <li><span className="dot dot--sel" /> Votre sélection</li>}
      </ul>
    </div>
  )
}
