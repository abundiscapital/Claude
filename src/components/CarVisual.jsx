import { useState } from 'react'
import CarSilhouette from './CarSilhouette.jsx'
import './CarVisual.css'

/*
  Visuel d'un véhicule.

  • Avec `src` (photo réelle, locale ou distante libre de droit) : on affiche la
    photo. Si elle échoue à charger, on retombe gracieusement sur le placeholder
    signature — jamais d'image cassée.
  • Sans `src` : scène sombre + halo coloré + silhouette (placeholder signature).

  `view` change le cadrage/halo du placeholder pour simuler plusieurs angles.
*/
export default function CarVisual({ accent = 'red', label, view = 'profile', src }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = src && !failed

  return (
    <div
      className={`carvisual carvisual--${accent} carvisual--${view} ${showPhoto ? 'carvisual--photo' : ''}`}
      role="img"
      aria-label={label}
    >
      {showPhoto ? (
        <img
          className="carvisual__img"
          src={src}
          alt={label ?? ''}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <div className="carvisual__glow" />
          <CarSilhouette className="carvisual__car" accent={accent} />
          <div className="carvisual__reflection" />
        </>
      )}
    </div>
  )
}
