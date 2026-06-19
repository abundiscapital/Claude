import { Zap } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  const cols = [
    { title: 'Explorer', links: ['Hypercars', 'Supercars', 'Grand Tourisme', 'SUV de prestige', 'Youngtimers'] },
    { title: 'Professionnels', links: ['Mettre en location', 'Espace pro', 'Tarifs & abonnements', 'ASPHALT Pro+'] },
    { title: 'Écosystème', links: ['Garages partenaires', 'Carrosserie & covering', 'Nettoyage', 'Assurances', 'Concessionnaires'] },
    { title: 'Confiance', links: ['Vérification d’identité', 'Assurance & caution', 'Aide', 'CGU · RGPD'] },
  ]
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo"><Zap size={18} aria-hidden="true" /> ASPHALT</span>
          <p className="text-muted">
            La marketplace du sport-luxe. Réunir tous les acteurs de la location haut de gamme
            et faire rayonner le secteur le plus glamour qui soit.
          </p>
        </div>
        <div className="footer__cols">
          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="footer__title">{c.title}</h3>
              <ul>
                {c.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="container footer__bar">
        <span className="text-muted">© {new Date().getFullYear()} ASPHALT — Tous droits réservés.</span>
        <span className="text-muted">Conçu pour les « quiet money ».</span>
      </div>
    </footer>
  )
}
