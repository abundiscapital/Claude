/*
  Silhouette stylisée d'une supercar (profil bas, type Huracán STO).
  Utilisée dans l'intro et comme motif de marque. Purement décoratif.
*/
export default function CarSilhouette({ className, headlights = true, accent = 'red' }) {
  const beam = accent === 'blue' ? 'var(--asph-blue-bright)' : 'var(--asph-red-bright)'
  return (
    <svg
      className={className}
      viewBox="0 0 640 200"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* corps profilé */}
      <path
        d="M18 150
           C 60 150 70 138 120 132
           C 150 110 180 96 250 92
           C 300 70 360 66 430 78
           C 500 84 560 104 600 120
           C 626 128 632 138 624 150
           L 600 150
           C 596 168 572 178 552 178
           C 532 178 508 168 504 150
           L 168 150
           C 164 168 140 178 120 178
           C 100 178 76 168 72 150
           Z"
        fill="url(#bodyGrad)"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.5"
      />
      {/* vitrage */}
      <path
        d="M262 92 C 300 76 356 74 416 82 L 470 104 L 250 110 Z"
        fill="rgba(120,150,210,0.18)"
      />
      {/* prise d'air latérale */}
      <path d="M300 124 L 392 120 L 388 132 L 300 134 Z" fill="rgba(0,0,0,0.55)" />
      {/* roues */}
      <circle cx="120" cy="150" r="30" fill="#0a0a0d" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle cx="120" cy="150" r="13" fill="#16161d" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      <circle cx="552" cy="150" r="30" fill="#0a0a0d" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <circle cx="552" cy="150" r="13" fill="#16161d" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
      {/* phare avant allumé */}
      {headlights && (
        <>
          <ellipse cx="610" cy="126" rx="10" ry="6" fill={beam} />
          <ellipse cx="610" cy="126" rx="22" ry="12" fill={beam} opacity="0.28" />
        </>
      )}
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="60" x2="0" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#26262f" />
          <stop offset="1" stopColor="#0d0d12" />
        </linearGradient>
      </defs>
    </svg>
  )
}
