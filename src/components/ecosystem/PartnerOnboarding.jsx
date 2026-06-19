import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, ArrowRight, Wrench, PaintBucket, SprayCan, ShieldCheck, Store } from 'lucide-react'
import { ONBOARDING_STEPS } from '../../data/ecosystem.js'
import '../auth/KycGate.css'
import './PartnerOnboarding.css'

const ACTIVITIES = [
  { id: 'garage', label: 'Garage & entretien', icon: Wrench },
  { id: 'body', label: 'Carrosserie & covering', icon: PaintBucket },
  { id: 'clean', label: 'Nettoyage & detailing', icon: SprayCan },
  { id: 'insurance', label: 'Assurance', icon: ShieldCheck },
  { id: 'dealer', label: 'Concessionnaire', icon: Store },
]

export default function PartnerOnboarding({ onClose }) {
  const [step, setStep] = useState(0)
  const [activity, setActivity] = useState(null)
  const [done, setDone] = useState(false)
  const isLast = step === ONBOARDING_STEPS.length - 1

  const next = () => {
    if (step === 0 && !activity) return
    if (isLast) setDone(true)
    else setStep((s) => s + 1)
  }

  return (
    <motion.div
      className="gate"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Devenir partenaire ASPHALT"
    >
      <motion.div
        className="gate__panel"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="gate__close" onClick={onClose} aria-label="Fermer">
          <X size={20} aria-hidden="true" />
        </button>

        {!done ? (
          <>
            <div className="gate__head">
              <p className="eyebrow">Rejoindre l’écosystème</p>
              <h2 className="gate__title">Développez votre activité avec ASPHALT.</h2>
              <p className="text-muted">
                Accédez à un flux régulier de loueurs et propriétaires de véhicules d’exception.
              </p>
            </div>

            <ol className="gate__steps" aria-label="Étapes">
              {ONBOARDING_STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`gate__dot ${i < step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}
                >
                  {i < step ? <Check size={14} aria-hidden="true" /> : i + 1}
                </li>
              ))}
            </ol>

            <div className="onb__body">
              <h3 className="gate__step-title">{ONBOARDING_STEPS[step]}</h3>

              {step === 0 && (
                <div className="onb__activities">
                  {ACTIVITIES.map((a) => (
                    <button
                      key={a.id}
                      className={`onb__activity ${activity === a.id ? 'is-active' : ''}`}
                      onClick={() => setActivity(a.id)}
                    >
                      <a.icon size={22} aria-hidden="true" />
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 1 && (
                <div className="gate__form onb__form">
                  <input placeholder="Raison sociale" aria-label="Raison sociale" />
                  <input placeholder="SIRET" inputMode="numeric" aria-label="SIRET" />
                  <input type="email" placeholder="Email professionnel" aria-label="Email" autoComplete="email" />
                </div>
              )}

              {step === 2 && (
                <div className="gate__form onb__form">
                  <input placeholder="Ville / zone d’intervention" aria-label="Zone" />
                  <input placeholder="Services proposés (séparés par des virgules)" aria-label="Services" />
                  <textarea rows={3} placeholder="Présentez votre savoir-faire…" aria-label="Présentation" />
                </div>
              )}

              {step === 3 && (
                <label className="gate__upload onb__upload">
                  <span className="gate__upload-cta">Déposer Kbis & assurance pro</span>
                  <span className="text-muted">PDF · vérification sous 48h</span>
                  <input type="file" className="sr-only" aria-label="Documents légaux" />
                </label>
              )}
            </div>

            <div className="gate__foot">
              <p className="gate__secure text-muted">
                <ShieldCheck size={14} aria-hidden="true" /> Sans engagement · commission à la mise en relation
              </p>
              <button className="btn btn--primary" onClick={next} disabled={step === 0 && !activity}>
                {isLast ? 'Envoyer ma candidature' : 'Continuer'}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : (
          <div className="gate__success">
            <motion.div
              className="gate__check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Check size={36} aria-hidden="true" />
            </motion.div>
            <h2 className="gate__title">Candidature envoyée.</h2>
            <p className="text-muted">
              Bienvenue dans l’écosystème ASPHALT. Notre équipe vérifie votre dossier et vous
              recontacte sous 48h pour activer votre fiche partenaire.
            </p>
            <button className="btn btn--primary btn--block" onClick={onClose}>Terminé</button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
