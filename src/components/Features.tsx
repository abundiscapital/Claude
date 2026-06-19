import { motion } from 'framer-motion'
import { Brain, Workflow, PenTool } from 'lucide-react'
import { fadeUp, scaleIn, stagger, viewportOnce } from '../lib/motion'

const features = [
  {
    icon: Brain,
    title: 'Closing assisté par IA',
    desc: "Twist analyse vos échanges en temps réel et suggère le bon argument, au bon moment. Détectez les signaux d'achat avant qu'ils ne s'éteignent.",
    accent: 'from-brand-400 to-brand-600',
    points: ['Scoring des deals en direct', 'Réponses suggérées', 'Détection des objections'],
  },
  {
    icon: Workflow,
    title: 'Pipeline automatisé',
    desc: "Relances, rappels et séquences se déclenchent tout seuls. Vos commerciaux passent leur temps à closer, pas à mettre à jour un CRM.",
    accent: 'from-accent-400 to-accent-500',
    points: ['Relances intelligentes', 'Séquences multicanal', 'Synchro CRM native'],
  },
  {
    icon: PenTool,
    title: 'Signature en un clic',
    desc: "Devis, contrat et signature électronique réunis. Le prospect signe depuis n'importe quel appareil, vous êtes notifié à la seconde.",
    accent: 'from-fuchsia-400 to-fuchsia-500',
    points: ['Signature légale eIDAS', 'Devis dynamiques', 'Notifications instantanées'],
  },
]

export default function Features() {
  return (
    <section id="features" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          variants={stagger()}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400"
          >
            Tout pour conclure
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Une plateforme, <span className="text-gradient">zéro friction</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-4 text-lg text-slate-400"
          >
            De la première prise de contact à la signature, Twist orchestre
            chaque étape de votre closing.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.article
                key={f.title}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm"
              >
                {/* Halo au survol */}
                <div
                  className={`pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br ${f.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30`}
                />
                <div
                  className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-ink-950 shadow-glow`}
                >
                  <Icon className="h-6 w-6" strokeWidth={2.4} />
                </div>
                <h3 className="text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {f.desc}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2.5 text-sm text-slate-300"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${f.accent}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
