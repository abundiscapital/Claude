import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fadeUp, stagger, viewportOnce } from '../lib/motion'

export default function CTA() {
  return (
    <section id="cta" className="relative px-6 py-28 sm:py-36">
      <motion.div
        variants={stagger(0.12, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 px-8 py-20 text-center sm:px-16"
      >
        {/* Dégradé animé du panneau CTA */}
        <div className="absolute inset-0 -z-10 animate-gradient-pan bg-[length:200%_200%] bg-gradient-to-br from-brand-600/40 via-accent-500/30 to-fuchsia-500/40" />
        <div className="absolute inset-0 -z-10 bg-ink-950/40" />
        <motion.div
          aria-hidden
          className="absolute -top-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.h2
          variants={fadeUp}
          className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
        >
          Prêt à closer comme jamais&nbsp;?
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl text-lg text-slate-200/90"
        >
          Rejoignez les 12 000 équipes qui signent plus vite avec Twist.
          Configuration en 2 minutes, aucune carte requise.
        </motion.p>

        <motion.form
          variants={fadeUp}
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            placeholder="Votre email professionnel"
            className="w-full rounded-xl border border-white/15 bg-ink-950/50 px-5 py-3.5 text-sm text-white placeholder:text-slate-400 backdrop-blur outline-none transition-colors focus:border-accent-400"
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-ink-950 shadow-glow"
          >
            Démarrer
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.form>

        <motion.p variants={fadeUp} className="mt-4 text-xs text-slate-300/70">
          14 jours d’essai · Sans engagement · Annulez à tout moment
        </motion.p>
      </motion.div>
    </section>
  )
}
