import type { Variants } from 'framer-motion'

// Easing courbe "premium" (out-expo approx) réutilisée partout.
export const easePremium = [0.16, 1, 0.3, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easePremium },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: easePremium } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: easePremium },
  },
}

// Conteneur qui orchestre l'apparition décalée de ses enfants.
export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
})

// Réglage commun pour le déclenchement au scroll.
export const viewportOnce = { once: true, amount: 0.3 } as const
