import { motion, useReducedMotion } from 'framer-motion'
import CarSilhouette from './CarSilhouette.jsx'
import './SplashIntro.css'

/*
  Écran d'ouverture signature : la supercar surgit du noir, phares allumés,
  un faisceau de lumière projeté vers elle. Charte rouge & bleu, ambiance
  "quiet money". Disparaît après l'animation ou au clic sur « Entrer ».
*/
export default function SplashIntro({ onEnter }) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* faisceau lumineux balayant la scène */}
      <motion.div
        className="splash__beam"
        initial={reduce ? { opacity: 0.5 } : { opacity: 0, rotate: -8 }}
        animate={reduce ? { opacity: 0.5 } : { opacity: [0, 0.9, 0.55], rotate: [-8, 2, 0] }}
        transition={{ duration: 1.8, ease: 'easeOut', delay: 0.2 }}
      />
      <div className="splash__floor" />

      <div className="splash__stage">
        <motion.div
          className="splash__car"
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: 60, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <CarSilhouette className="splash__silhouette" accent="red" />
          <motion.span
            className="splash__headlight"
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 1] }}
            transition={{ duration: 1, delay: 1.1, ease: 'easeInOut' }}
          />
        </motion.div>

        <motion.div
          className="splash__wordmark"
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
        >
          <h1 className="splash__title">ASPHALT</h1>
          <p className="splash__sub">Le sport-luxe, en un clic.</p>
        </motion.div>
      </div>

      <motion.button
        className="btn btn--primary splash__enter"
        onClick={onEnter}
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        Entrer
      </motion.button>

      <button className="splash__skip" onClick={onEnter}>
        Passer l’intro
      </button>
    </motion.div>
  )
}
