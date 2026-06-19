import { useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, ArrowLeft } from 'lucide-react'
import { CARS, CATEGORIES } from '../../data/cars.js'
import CarCard from './CarCard.jsx'
import './Home.css'

export default function SearchResults() {
  const [params] = useSearchParams()
  const ville = params.get('ville') || ''
  const cat = params.get('cat') || 'all'

  const results = useMemo(() => {
    return CARS.filter((c) => {
      const okCat = cat === 'all' || c.category === cat
      const okVille = !ville || c.city.toLowerCase().includes(ville.toLowerCase())
      return okCat && okVille
    })
  }, [ville, cat])

  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label

  return (
    <div className="container section">
      <Link to="/" className="backlink">
        <ArrowLeft size={16} aria-hidden="true" /> Retour
      </Link>

      <div className="section__head">
        <div>
          <h1 className="section__title">
            {results.length} véhicule{results.length > 1 ? 's' : ''} disponible
            {results.length > 1 ? 's' : ''}
          </h1>
          <p className="text-muted">
            {ville ? `À ${ville}` : 'Partout en Europe'}
            {cat !== 'all' ? ` · ${catLabel}` : ''}
          </p>
        </div>
        <button className="btn btn--ghost">
          <SlidersHorizontal size={16} aria-hidden="true" /> Filtres
        </button>
      </div>

      {results.length > 0 ? (
        <div className="grid">
          {results.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h3>Aucun véhicule pour cette recherche</h3>
          <p className="text-muted">
            Élargissez la zone ou la catégorie — notre flotte s’enrichit chaque semaine.
          </p>
          <Link to="/" className="btn btn--primary">Explorer toute la flotte</Link>
        </div>
      )}
    </div>
  )
}
