import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { fadeUp, scaleIn, stagger, viewportOnce } from '../lib/motion'

const plans = [
  {
    name: 'Starter',
    price: '29',
    tagline: 'Pour les indépendants qui démarrent.',
    features: [
      'Jusqu’à 3 utilisateurs',
      'Pipeline illimité',
      'Relances automatiques',
      'Signature électronique',
      'Support par email',
    ],
    cta: 'Commencer',
    featured: false,
  },
  {
    name: 'Growth',
    price: '79',
    tagline: 'Pour les équipes qui scalent leur closing.',
    features: [
      'Jusqu’à 20 utilisateurs',
      'Closing assisté par IA',
      'Séquences multicanal',
      'Synchro CRM native',
      'Analytics avancés',
      'Support prioritaire',
    ],
    cta: 'Essayer 14 jours',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Sur devis',
    tagline: 'Pour les organisations exigeantes.',
    features: [
      'Utilisateurs illimités',
      'SSO & SAML',
      'Conformité eIDAS avancée',
      'API & webhooks',
      'Manager de compte dédié',
      'SLA 99,9 %',
    ],
    cta: 'Nous contacter',
    featured: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-brand-600/15 blur-[130px]"
      />
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
            Tarifs
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Un prix pour chaque <span className="text-gradient">ambition</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-lg text-slate-400">
            Sans engagement. Changez ou annulez à tout moment.
          </motion.p>
        </motion.div>

        <motion.div
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="mt-16 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={scaleIn}
              whileHover={{ y: -8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={`relative flex flex-col rounded-3xl border p-8 backdrop-blur-sm ${
                plan.featured
                  ? 'border-transparent bg-gradient-to-b from-brand-500/15 to-ink-900/40 shadow-glow lg:-mt-4 lg:mb-4'
                  : 'border-white/10 bg-white/[0.03]'
              }`}
            >
              {plan.featured && (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-brand-400/40 to-transparent p-px [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]" />
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-400 via-accent-400 to-fuchsia-400 px-4 py-1 text-xs font-bold text-ink-950">
                    Le plus populaire
                  </span>
                </>
              )}

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="mt-1.5 text-sm text-slate-400">{plan.tagline}</p>

              <div className="mt-6 flex items-end gap-1.5">
                {plan.price === 'Sur devis' ? (
                  <span className="text-4xl font-extrabold text-white">
                    Sur devis
                  </span>
                ) : (
                  <>
                    <span className="text-5xl font-extrabold text-white">
                      {plan.price}€
                    </span>
                    <span className="mb-1.5 text-sm text-slate-400">
                      /mois /utilisateur
                    </span>
                  </>
                )}
              </div>

              <ul className="mt-8 space-y-3.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-300">
                    <span
                      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                        plan.featured
                          ? 'bg-gradient-to-br from-brand-400 to-accent-400 text-ink-950'
                          : 'bg-white/10 text-accent-400'
                      }`}
                    >
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#cta"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                  plan.featured
                    ? 'bg-white text-ink-950 shadow-glow'
                    : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </motion.a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
