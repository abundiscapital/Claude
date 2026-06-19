import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { fadeUp, stagger, easePremium } from '../lib/motion'

const stats = [
  { value: '+38%', label: 'de taux de closing' },
  { value: '4 min', label: 'pour signer un deal' },
  { value: '12k+', label: 'équipes commerciales' },
]

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32">
      {/* Dégradé animé de fond */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-gradient-pan bg-[length:200%_200%] bg-gradient-to-br from-ink-950 via-ink-900 to-brand-600/30" />
        {/* Orbes flottants */}
        <motion.div
          aria-hidden
          className="absolute -top-24 left-1/4 h-[34rem] w-[34rem] rounded-full bg-brand-500/30 blur-[120px]"
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute top-20 right-1/4 h-[28rem] w-[28rem] rounded-full bg-accent-500/25 blur-[120px]"
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/20 blur-[120px]"
          animate={{ x: [0, 30, -40, 0], y: [0, -20, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grille discrète */}
        <div className="absolute inset-0 bg-grid-faint bg-[size:46px_46px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <motion.div
        variants={stagger(0.14, 0.1)}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
      >
        <motion.a
          variants={fadeUp}
          href="#features"
          className="group mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-400" />
          Nouveau&nbsp;: closing assisté par IA
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        <motion.h1
          variants={fadeUp}
          className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          Transformez chaque
          <br />
          conversation en{' '}
          <span className="text-gradient">deal signé</span>.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300/90 sm:text-xl"
        >
          Twist réunit pipeline intelligent, relances automatiques et signature
          en un clic. La plateforme de closing pensée pour les équipes qui
          veulent conclure plus vite, sans friction.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-ink-950 shadow-glow"
          >
            Démarrer gratuitement
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
          <motion.a
            href="#features"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
          >
            <Play className="h-4 w-4 fill-current" />
            Voir la démo
          </motion.a>
        </motion.div>

        {/* Stats */}
        <motion.dl
          variants={fadeUp}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-5 backdrop-blur"
            >
              <dt className="text-2xl font-bold text-white sm:text-3xl">
                {s.value}
              </dt>
              <dd className="mt-1 text-xs text-slate-400 sm:text-sm">{s.label}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* Aperçu produit flottant */}
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: easePremium, delay: 0.5 }}
        className="mx-auto mt-20 max-w-5xl px-6 [perspective:1200px]"
      >
        <div className="animate-float overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 shadow-card backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
            <span className="h-3 w-3 rounded-full bg-green-400/80" />
            <span className="ml-3 text-xs text-slate-500">app.twist.io/pipeline</span>
          </div>
          <div className="grid grid-cols-3 gap-4 p-5">
            {['Prospection', 'Négociation', 'Closing'].map((col, i) => (
              <div key={col} className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {col}
                </p>
                {Array.from({ length: 3 - i + 1 }).map((_, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.15 + j * 0.1, ease: easePremium }}
                    className="rounded-lg border border-white/5 bg-white/[0.04] p-3"
                  >
                    <div className="h-2 w-2/3 rounded bg-gradient-to-r from-brand-400/60 to-accent-400/60" />
                    <div className="mt-2 h-2 w-1/3 rounded bg-white/10" />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
