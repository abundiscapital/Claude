import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X, IdCard, Car, FileText, CreditCard, ShieldCheck, Check, Lock, ArrowRight,
} from 'lucide-react'
import { formatEUR } from '../../data/cars.js'
import './KycGate.css'

/*
  Parcours d'authentification & vérification ("chaque utilisateur est un client
  potentiel"). La connexion n'est demandée qu'ICI — une fois le véhicule trouvé.
  Étapes : compte → identité → permis → domicile → moyen de paiement & solvabilité
  → acompte. Démo front : la logique de vérification réelle (KYC/AML) est branchée
  côté API (voir README › Architecture).
*/
const STEPS = [
  { id: 'account', icon: Lock, title: 'Créer votre accès', hint: 'Email & téléphone vérifiés' },
  { id: 'identity', icon: IdCard, title: "Pièce d'identité", hint: "CNI ou passeport en cours de validité" },
  { id: 'licence', icon: Car, title: 'Permis de conduire', hint: 'Recto/verso · ancienneté requise' },
  { id: 'address', icon: FileText, title: 'Justificatif de domicile', hint: '— de 3 mois' },
  { id: 'payment', icon: CreditCard, title: 'Carte & solvabilité', hint: 'Empreinte bancaire, aucun débit' },
]

export default function KycGate({ car, total, onClose, onComplete }) {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const next = () => {
    if (isLast) {
      setDone(true)
    } else {
      setStep((s) => s + 1)
    }
  }

  const deposit = Math.round(total * 0.3)

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
      aria-label="Vérification du dossier de location"
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
              <p className="eyebrow">Dossier locataire · {car.brand} {car.model}</p>
              <h2 className="gate__title">Prouvez que la route vous appartient.</h2>
              <p className="text-muted">
                Une vérification unique, sécurisée et réutilisable pour toutes vos
                prochaines locations sur ASPHALT.
              </p>
            </div>

            {/* progression */}
            <ol className="gate__steps" aria-label="Étapes">
              {STEPS.map((s, i) => (
                <li
                  key={s.id}
                  className={`gate__dot ${i < step ? 'is-done' : ''} ${i === step ? 'is-active' : ''}`}
                >
                  {i < step ? <Check size={14} aria-hidden="true" /> : i + 1}
                </li>
              ))}
            </ol>

            <div className="gate__body">
              <div className="gate__icon"><current.icon size={26} aria-hidden="true" /></div>
              <h3 className="gate__step-title">{current.title}</h3>
              <p className="text-muted">{current.hint}</p>

              <div className="gate__drop">
                {current.id === 'account' ? (
                  <div className="gate__form">
                    <input type="email" inputMode="email" placeholder="Adresse email" aria-label="Email" autoComplete="email" />
                    <input type="tel" inputMode="tel" placeholder="Téléphone mobile" aria-label="Téléphone" autoComplete="tel" />
                  </div>
                ) : current.id === 'payment' ? (
                  <div className="gate__form">
                    <input inputMode="numeric" placeholder="Numéro de carte" aria-label="Numéro de carte" autoComplete="cc-number" />
                    <div className="gate__form-row">
                      <input placeholder="MM / AA" aria-label="Expiration" autoComplete="cc-exp" />
                      <input inputMode="numeric" placeholder="CVC" aria-label="CVC" autoComplete="cc-csc" />
                    </div>
                    <p className="gate__hint text-muted">
                      Empreinte bancaire pour vérifier la solvabilité. Débit uniquement de
                      l’acompte ({formatEUR(deposit)}) à la confirmation.
                    </p>
                  </div>
                ) : (
                  <label className="gate__upload">
                    <span className="gate__upload-cta">Déposer un document</span>
                    <span className="text-muted">JPG, PNG ou PDF · chiffré de bout en bout</span>
                    <input type="file" className="sr-only" aria-label={current.title} />
                  </label>
                )}
              </div>
            </div>

            <div className="gate__foot">
              <p className="gate__secure text-muted">
                <ShieldCheck size={14} aria-hidden="true" /> Données chiffrées · conformes RGPD
              </p>
              <button className="btn btn--primary" onClick={next}>
                {isLast ? 'Valider mon dossier' : 'Continuer'}
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
            <h2 className="gate__title">Dossier envoyé.</h2>
            <p className="text-muted">
              Votre demande pour la <strong>{car.brand} {car.model}</strong> est transmise au
              loueur. Acompte de {formatEUR(deposit)} pré-autorisé, débité à la confirmation.
              Vous êtes désormais un client vérifié ASPHALT.
            </p>
            <button className="btn btn--primary btn--block" onClick={onComplete}>
              Terminé
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
