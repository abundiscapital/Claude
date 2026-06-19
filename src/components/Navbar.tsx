import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { easePremium } from '../lib/motion'

const links = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Tarifs', href: '#pricing' },
  { label: 'Clients', href: '#cta' },
]

export default function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24))

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easePremium }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <motion.nav
        animate={{
          backgroundColor: scrolled ? 'rgba(10,11,26,0.72)' : 'rgba(10,11,26,0)',
          borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0)',
          boxShadow: scrolled
            ? '0 20px 60px -20px rgba(0,0,0,0.7)'
            : '0 0 0 rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.4, ease: easePremium }}
        className="flex w-full max-w-6xl items-center justify-between rounded-2xl border px-5 py-3 backdrop-blur-xl"
      >
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-accent-400 to-fuchsia-400 text-sm font-black text-ink-950">
            T
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Twist</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm font-medium text-slate-300 transition-colors hover:text-white sm:block"
          >
            Connexion
          </a>
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink-950 shadow-glow transition-shadow hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.5)]"
          >
            Essai gratuit
          </motion.a>
        </div>
      </motion.nav>
    </motion.header>
  )
}
