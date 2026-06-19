/* Données de démonstration pour le tableau de bord propriétaire. */

export const KPIS = [
  { id: 'revenue', label: 'Revenus du mois', value: '48 200 €', delta: '+18 %', trend: 'up' },
  { id: 'rate', label: 'Taux d’occupation', value: '72 %', delta: '+6 pts', trend: 'up' },
  { id: 'active', label: 'Locations en cours', value: '5', delta: '2 départs aujourd’hui', trend: 'flat' },
  { id: 'pending', label: 'Demandes à valider', value: '3', delta: 'Dont 1 dossier complet', trend: 'flat' },
]

export const FLEET = [
  { id: 'sto-furia', name: 'Huracán STO', plate: 'GP-820-AS', status: 'rented', price: 1690, nextEvent: 'Retour 21 juin · 9h' },
  { id: '296-rosso', name: 'Ferrari 296 GTB', plate: 'CN-114-RS', status: 'available', price: 1890, nextEvent: 'Libre' },
  { id: 'revuelto-or', name: 'Revuelto', plate: 'PA-009-RV', status: 'rented', price: 3200, nextEvent: 'Retour 23 juin · 18h' },
  { id: 'gt3-rs-blanc', name: '911 GT3 RS', plate: 'LY-525-PR', status: 'maintenance', price: 1290, nextEvent: 'Révision · garage Bosch' },
  { id: 'urus-nuit', name: 'Urus Performante', plate: 'GE-666-LL', status: 'available', price: 990, nextEvent: 'Libre' },
]

export const PLANNING = [
  { id: 1, car: 'Huracán STO', type: 'departure', client: 'M. Lefort', time: 'Aujourd’hui · 14h00', place: 'Paris 8e' },
  { id: 2, car: 'Revuelto', type: 'return', client: 'Mme Ravel', time: 'Aujourd’hui · 18h30', place: 'Le Bourget' },
  { id: 3, car: '296 GTB', type: 'departure', client: 'M. Costa', time: 'Demain · 10h00', place: 'Cannes' },
  { id: 4, car: '911 GT3 RS', type: 'maintenance', client: 'Garage Bosch', time: '22 juin · journée', place: 'Lyon 7e' },
]

export const PAYMENTS = [
  { id: 'INV-2041', client: 'M. Lefort', car: 'Huracán STO', amount: 3718, status: 'paid', kind: 'Acompte + solde' },
  { id: 'INV-2042', client: 'Mme Ravel', car: 'Revuelto', amount: 2112, status: 'deposit', kind: 'Acompte 30 %' },
  { id: 'INV-2043', client: 'M. Costa', car: '296 GTB', amount: 4158, status: 'pending', kind: 'En attente' },
  { id: 'INV-2039', client: 'M. Brun', car: 'Urus', amount: 320, status: 'extra', kind: 'Frais carburant (post-location)' },
]

export const STATUS_LABEL = {
  rented: 'En location',
  available: 'Disponible',
  maintenance: 'Immobilisé',
  paid: 'Payé',
  deposit: 'Acompte versé',
  pending: 'En attente',
  extra: 'Frais à facturer',
}
