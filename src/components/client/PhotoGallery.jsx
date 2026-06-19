import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Expand } from 'lucide-react'
import CarVisual from '../CarVisual.jsx'
import './PhotoGallery.css'

/*
  Galerie immersive : une vue héroïque + vignettes, et un lightbox plein écran
  navigable. Les "photos" sont des CarVisual multi-angles (placeholders).
*/
export default function PhotoGallery({ views, label }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = (dir) => setActive((i) => (i + dir + views.length) % views.length)

  return (
    <>
      <div className="gallery">
        <button
          type="button"
          className="gallery__hero"
          onClick={() => setLightbox(true)}
          aria-label={`Agrandir ${label}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <CarVisual accent={views[active].accent} view={views[active].view} src={views[active].src} label={label} />
            </motion.div>
          </AnimatePresence>
          <span className="gallery__expand"><Expand size={16} aria-hidden="true" /> Voir en grand</span>
          <span className="gallery__count tabular">{active + 1} / {views.length}</span>
        </button>

        <div className="gallery__thumbs" role="tablist" aria-label="Vues du véhicule">
          {views.map((v, i) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={i === active}
              className={`gallery__thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              <CarVisual accent={v.accent} view={v.view} src={v.src} label={`${label} — ${v.label}`} />
              <span className="gallery__thumb-label">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Galerie ${label}`}
          >
            <button className="lightbox__close" onClick={() => setLightbox(false)} aria-label="Fermer">
              <X size={22} aria-hidden="true" />
            </button>
            <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label="Vue précédente"
            >
              <ChevronLeft size={28} aria-hidden="true" />
            </button>
            <motion.div
              className="lightbox__stage"
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <CarVisual accent={views[active].accent} view={views[active].view} src={views[active].src} label={label} />
              <p className="lightbox__caption">{views[active].label} · {label}</p>
            </motion.div>
            <button
              className="lightbox__nav lightbox__nav--next"
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label="Vue suivante"
            >
              <ChevronRight size={28} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
