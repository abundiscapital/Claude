import CarSilhouette from './CarSilhouette.jsx'
import './CarVisual.css'

/*
  Placeholder visuel d'un véhicule : scène sombre + halo coloré selon l'accent
  de marque + silhouette. Remplace une photo le temps d'intégrer la photothèque.
  `view` change le cadrage/halo pour simuler plusieurs angles dans la galerie.
*/
export default function CarVisual({ accent = 'red', label, view = 'profile' }) {
  return (
    <div
      className={`carvisual carvisual--${accent} carvisual--${view}`}
      role="img"
      aria-label={label}
    >
      <div className="carvisual__glow" />
      <CarSilhouette className="carvisual__car" accent={accent} />
      <div className="carvisual__reflection" />
    </div>
  )
}
