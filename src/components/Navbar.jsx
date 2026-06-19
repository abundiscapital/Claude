import { Link, useLocation } from 'react-router-dom'
import { Zap, LayoutDashboard, Search, Network, MessageCircle } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const onPro = pathname.startsWith('/pro')

  return (
    <header className="nav">
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="ASPHALT — accueil">
          <Zap size={18} className="nav__brand-mark" aria-hidden="true" />
          <span>ASPHALT</span>
        </Link>

        <nav className="nav__links" aria-label="Navigation principale">
          <Link
            to="/"
            className={`nav__link ${!onPro ? 'is-active' : ''}`}
          >
            <Search size={16} aria-hidden="true" /> Explorer
          </Link>
          <Link
            to="/ecosysteme"
            className={`nav__link ${pathname.startsWith('/ecosysteme') ? 'is-active' : ''}`}
          >
            <Network size={16} aria-hidden="true" /> Écosystème
          </Link>
          <Link
            to="/messages"
            className={`nav__link ${pathname.startsWith('/messages') ? 'is-active' : ''}`}
          >
            <MessageCircle size={16} aria-hidden="true" /> Messages
          </Link>
          <Link
            to="/pro"
            className={`nav__link ${onPro ? 'is-active' : ''}`}
          >
            <LayoutDashboard size={16} aria-hidden="true" /> Espace pro
          </Link>
        </nav>

        <div className="nav__actions">
          <Link to="/pro" className="btn btn--ghost nav__cta-ghost">
            Mettre en location
          </Link>
          <Link to="/connexion" className="btn btn--primary nav__cta">
            Connexion
          </Link>
        </div>
      </div>
    </header>
  )
}
