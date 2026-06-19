const groups = [
  {
    title: 'Produit',
    links: ['Fonctionnalités', 'Tarifs', 'Intégrations', 'Nouveautés'],
  },
  {
    title: 'Entreprise',
    links: ['À propos', 'Clients', 'Carrières', 'Blog'],
  },
  {
    title: 'Ressources',
    links: ['Documentation', 'Centre d’aide', 'API', 'Statut'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <a href="#" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-accent-400 to-fuchsia-400 text-sm font-black text-ink-950">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-white">
              Twist
            </span>
          </a>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            La plateforme de closing qui transforme vos conversations en deals
            signés.
          </p>
        </div>

        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-semibold text-white">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Twist. Tous droits réservés.</p>
        <div className="flex gap-6">
          <a href="#" className="transition-colors hover:text-white">
            Confidentialité
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Conditions
          </a>
        </div>
      </div>
    </footer>
  )
}
