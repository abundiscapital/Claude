/* Annuaire de l'écosystème ASPHALT : les pros qui font tourner la filière. */

export const PARTNER_TYPES = [
  { id: 'all', label: 'Tous' },
  { id: 'garage', label: 'Garages & entretien' },
  { id: 'body', label: 'Carrosserie & covering' },
  { id: 'clean', label: 'Nettoyage & detailing' },
  { id: 'insurance', label: 'Assurances' },
  { id: 'dealer', label: 'Concessionnaires' },
]

export const PARTNERS = [
  {
    id: 'p1', name: 'Maranello Service', type: 'garage', city: 'Paris', rating: 4.9, jobs: 320,
    services: ['Révision', 'Vidange', 'Pré-location'], blurb: 'Spécialiste V8/V12 italiens, agréé constructeurs.',
  },
  {
    id: 'p2', name: 'Atelier Carbone', type: 'body', city: 'Lyon', rating: 4.8, jobs: 145,
    services: ['Covering', 'PPF', 'Réparation jante'], blurb: 'Covering sur-mesure et protection peinture pour véhicules d’exception.',
  },
  {
    id: 'p3', name: 'Prestige Detailing', type: 'clean', city: 'Cannes', rating: 5.0, jobs: 410,
    services: ['Detailing', 'Céramique', 'Remise en état'], blurb: 'Préparation premium entre deux locations, finitions concours.',
  },
  {
    id: 'p4', name: 'AXA Mobility Lux', type: 'insurance', city: 'National', rating: 4.7, jobs: 1200,
    services: ['Tous risques location', 'Caution', 'Assistance 24/7'], blurb: 'Contrats taillés pour la location courte durée haut de gamme.',
  },
  {
    id: 'p5', name: 'Riviera Motors', type: 'dealer', city: 'Monaco', rating: 4.9, jobs: 78,
    services: ['Achat / reprise', 'Sourcing', 'Financement'], blurb: 'Sourcing de super & hypercars pour loueurs qui se lancent.',
  },
  {
    id: 'p6', name: 'Bosch Car Service Lyon', type: 'garage', city: 'Lyon', rating: 4.6, jobs: 540,
    services: ['Diagnostic', 'Freinage', 'Pneumatiques'], blurb: 'Réseau de confiance pour l’entretien courant de la flotte.',
  },
  {
    id: 'p7', name: 'Wrap & Co', type: 'body', city: 'Paris', rating: 4.7, jobs: 210,
    services: ['Total covering', 'Déco', 'Vitres teintées'], blurb: 'Mises en beauté et identités visuelles de flotte.',
  },
  {
    id: 'p8', name: 'Hiscox Prestige', type: 'insurance', city: 'National', rating: 4.8, jobs: 860,
    services: ['Valeur agréée', 'Multi-véhicules', 'Événementiel'], blurb: 'Assurance valeur agréée pour collections et flottes premium.',
  },
]

export const ONBOARDING_STEPS = [
  'Type d’activité',
  'Informations société',
  'Zone & services',
  'Vérification',
]
