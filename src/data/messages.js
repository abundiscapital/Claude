/* Conversations de démonstration client ↔ loueur. */

export const CONVERSATIONS = [
  {
    id: 'c1',
    with: 'Maranello Prestige',
    car: 'Huracán STO',
    verified: true,
    unread: 1,
    accent: 'red',
    messages: [
      { id: 1, from: 'them', text: 'Bonjour ! La STO est disponible à vos dates. Souhaitez-vous une livraison voiturier ?', at: '09:12' },
      { id: 2, from: 'me', text: 'Bonjour, oui idéalement à Paris 8e vendredi matin.', at: '09:20' },
      { id: 3, from: 'them', text: 'Parfait, c’est noté. Je vous prépare le contrat dès validation de votre dossier.', at: '09:24' },
    ],
  },
  {
    id: 'c2',
    with: 'Côte d’Azur Motors',
    car: 'Ferrari 296 GTB',
    verified: true,
    unread: 0,
    accent: 'blue',
    messages: [
      { id: 1, from: 'me', text: 'Le toit ouvrant est-il bien inclus dans l’offre ?', at: 'Hier' },
      { id: 2, from: 'them', text: 'Oui, toit ouvrant et pack carbone compris. Bonne route à Cannes !', at: 'Hier' },
    ],
  },
  {
    id: 'c3',
    with: 'Riviera Collection',
    car: 'Bugatti Chiron',
    verified: true,
    unread: 0,
    accent: 'blue',
    messages: [
      { id: 1, from: 'them', text: 'Votre demande nécessite une validation manuelle. Notre conciergerie vous rappelle sous 2h.', at: 'Lun.' },
    ],
  },
]
