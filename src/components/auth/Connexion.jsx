import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowRight } from 'lucide-react'
import './Connexion.css'

export default function Connexion() {
  return (
    <div className="login">
      <div className="login__beam" aria-hidden="true" />
      <div className="login__card">
        <Link to="/" className="login__brand">
          <Zap size={18} aria-hidden="true" /> ASPHALT
        </Link>
        <h1 className="login__title">Ravi de vous revoir.</h1>
        <p className="text-muted">
          Connectez-vous pour retrouver vos réservations, votre dossier vérifié et vos
          véhicules favoris.
        </p>

        <form className="login__form" onSubmit={(e) => e.preventDefault()}>
          <label className="login__field">
            <Mail size={18} aria-hidden="true" />
            <input type="email" placeholder="Adresse email" aria-label="Email" autoComplete="email" />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Continuer <ArrowRight size={16} aria-hidden="true" />
          </button>
        </form>

        <p className="login__alt text-muted">
          Pas encore de compte ? Trouvez d’abord votre véhicule —{' '}
          <Link to="/" className="login__link">explorer la flotte</Link>.
        </p>
      </div>
    </div>
  )
}
