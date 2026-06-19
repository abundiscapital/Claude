/*
  Flotte de démonstration ASPHALT.
  Chaque véhicule a une histoire : un désir, une image que l'on renvoie au monde.
  Les visuels sont des dégradés signature (placeholders) — à remplacer par la
  photothèque pro. `accent` pilote l'ambiance lumineuse de la carte.
*/

export const CATEGORIES = [
  { id: 'all', label: 'Tout' },
  { id: 'hyper', label: 'Hypercars' },
  { id: 'super', label: 'Supercars' },
  { id: 'gt', label: 'Grand Tourisme' },
  { id: 'suv', label: 'SUV de prestige' },
  { id: 'youngtimer', label: 'Youngtimers' },
]

/* Helper : URL Unsplash (libre de droit) cadrée pour nos vignettes 16/10. */
const u = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1280&q=80`

export const CARS = [
  {
    // Véhicule réel du loueur — photos personnelles (public/cars/rs3/).
    id: 'rs3-berline-9k',
    brand: 'Audi',
    model: 'RS3 Berline',
    year: 2025,
    category: 'super',
    city: 'Genève',
    seats: 5,
    power: 400,
    gearbox: 'S tronic 7',
    pricePerDay: 390,
    deposit: 4000,
    rating: 5.0,
    reviews: 9,
    accent: 'red',
    tagline: 'Le cinq-cylindres qui n’a peur de personne.',
    story:
      "Mythic Black de la calandre au diffuseur, feux Matrix OLED signant la nuit d’un trait rouge. Sous le capot, le légendaire 2.5 TFSI cinq-cylindres — 400 chevaux et une sonorité que rien n’imite. À bord, baquets RS nid d’abeille surpiqués de rouge, Virtual Cockpit Plus et ambiance bleutée : une berline taillée pour ceux qui veulent tout, sans rien montrer.",
    specs: { '0-100': '3.8 s', vmax: '290 km/h', poids: '1570 kg' },
    options: ['Toit panoramique', 'Pack RS Design rouge', 'Échappement RS', 'Matrix LED OLED', 'Virtual Cockpit Plus', 'Sièges baquets RS', 'Caméra 360°', 'B&O Sound'],
    instantBook: true,
    owner: { name: '9K Luxury', verified: true, fleet: 7 },
    images: [
      { src: '/cars/rs3/front.jpeg', label: 'Avant' },
      { src: '/cars/rs3/rear.jpeg', label: '3/4 arrière' },
      { src: '/cars/rs3/cockpit.jpeg', label: 'Cockpit' },
      { src: '/cars/rs3/seats.jpeg', label: 'Baquets RS' },
    ],
  },
  {
    id: 'sto-furia',
    brand: 'Lamborghini',
    model: 'Huracán STO',
    year: 2023,
    category: 'super',
    city: 'Paris',
    seats: 2,
    power: 640,
    gearbox: 'Séquentielle',
    pricePerDay: 1690,
    deposit: 8000,
    rating: 4.97,
    reviews: 48,
    accent: 'red',
    tagline: 'La piste, homologuée pour la rue.',
    story:
      "Née du sang des Super Trofeo, la STO ne demande pas la permission. Phares allumés dans la nuit parisienne, elle transforme chaque tunnel en circuit et chaque regard en désir.",
    specs: { '0-100': '3.0 s', vmax: '310 km/h', poids: '1339 kg' },
    options: ['Mode Pista', 'Échappement sport', 'Baquets carbone', 'Livraison voiturier'],
    instantBook: true,
    owner: { name: 'Maranello Prestige', verified: true, fleet: 12 },
    images: [
      { src: u('1544636331-e26879cd4d9b'), label: 'Profil' },
      { src: u('1614162692292-7ac56d7f7f1e'), label: 'Avant' },
      { src: u('1525609004556-c46c7d6cf023'), label: 'Arrière' },
    ],
  },
  {
    id: 'chiron-noir',
    brand: 'Bugatti',
    model: 'Chiron',
    year: 2022,
    category: 'hyper',
    city: 'Monaco',
    seats: 2,
    power: 1500,
    gearbox: 'Double embrayage',
    pricePerDay: 9800,
    deposit: 50000,
    rating: 5.0,
    reviews: 7,
    accent: 'blue',
    tagline: '1500 chevaux de silence avant la foudre.',
    story:
      "Il y a les voitures rapides, et il y a le Chiron. Un quatre-turbos W16 taillé pour l'absolu, réservé à ceux qui n'ont plus rien à prouver — seulement à ressentir.",
    specs: { '0-100': '2.4 s', vmax: '420 km/h', poids: '1996 kg' },
    options: ['Conciergerie dédiée', 'Transport plateau fermé', 'Chauffeur sur demande'],
    instantBook: false,
    owner: { name: 'Riviera Collection', verified: true, fleet: 5 },
    images: [
      { src: u('1566024287286-457247b70310'), label: 'Profil' },
      { src: u('1592198084033-aade902d1aae'), label: 'Avant' },
    ],
  },
  {
    id: '296-rosso',
    brand: 'Ferrari',
    model: '296 GTB',
    year: 2024,
    category: 'super',
    city: 'Cannes',
    seats: 2,
    power: 830,
    gearbox: 'Double embrayage',
    pricePerDay: 1890,
    deposit: 10000,
    rating: 4.93,
    reviews: 31,
    accent: 'red',
    tagline: 'Le V6 qui a redéfini le frisson.',
    story:
      "Sur la Croisette au coucher du soleil, la 296 GTB chante une partition hybride inédite. Rosso Corsa sur cuir crème : l'élégance qui n'a pas besoin de crier pour être entendue.",
    specs: { '0-100': '2.9 s', vmax: '330 km/h', poids: '1470 kg' },
    options: ['Toit ouvrant', 'Pack carbone', 'Sièges chauffants', 'Apple CarPlay'],
    instantBook: true,
    owner: { name: 'Côte d’Azur Motors', verified: true, fleet: 18 },
    images: [
      { src: u('1583121274602-3e2820c69888'), label: 'Profil' },
      { src: u('1592198084033-aade902d1aae'), label: 'Avant' },
      { src: u('1605559424843-9e4c228bf1c2'), label: 'Détail' },
    ],
  },
  {
    id: 'gt3-rs-blanc',
    brand: 'Porsche',
    model: '911 GT3 RS',
    year: 2023,
    category: 'super',
    city: 'Lyon',
    seats: 2,
    power: 525,
    gearbox: 'PDK',
    pricePerDay: 1290,
    deposit: 7000,
    rating: 4.95,
    reviews: 64,
    accent: 'blue',
    tagline: "L'aileron qui aspire l'horizon.",
    story:
      "Aileron col de cygne, atmosphérique hurlant à 9000 tours. La GT3 RS ne se conduit pas, elle se mérite. Une leçon d'ingénierie pour puristes assumés.",
    specs: { '0-100': '3.2 s', vmax: '296 km/h', poids: '1450 kg' },
    options: ['Pack Weissach', 'Roll-bar', 'Télémétrie circuit', 'Casques fournis'],
    instantBook: true,
    owner: { name: 'Rhône Supercars', verified: true, fleet: 9 },
    images: [
      { src: u('1503376780353-7e6692767b70'), label: 'Profil' },
      { src: u('1611821064430-0d40291d0f0b'), label: 'Avant' },
      { src: u('1614200187524-dc4b892acf16'), label: 'Détail' },
    ],
  },
  {
    id: 'urus-nuit',
    brand: 'Lamborghini',
    model: 'Urus Performante',
    year: 2024,
    category: 'suv',
    city: 'Genève',
    seats: 5,
    power: 666,
    gearbox: 'Automatique',
    pricePerDay: 990,
    deposit: 6000,
    rating: 4.89,
    reviews: 73,
    accent: 'red',
    tagline: 'La famille n’a jamais voyagé aussi vite.',
    story:
      "Le SUV qui refuse les compromis. Cinq places, un coffre, et l'âme d'un taureau. Pour les week-ends à la montagne où l'on arrive avant la poudreuse.",
    specs: { '0-100': '3.3 s', vmax: '306 km/h', poids: '2150 kg' },
    options: ['4 places confort', 'Attelage', 'Toit panoramique', 'B&O Sound'],
    instantBook: true,
    owner: { name: 'Léman Luxury Cars', verified: true, fleet: 22 },
    images: [
      { src: u('1606664515524-ed2f786a0bd6'), label: 'Profil' },
      { src: u('1622200294772-e411a2e0bb85'), label: 'Avant' },
    ],
  },
  {
    id: 'dbs-gt',
    brand: 'Aston Martin',
    model: 'DBS Superleggera',
    year: 2022,
    category: 'gt',
    city: 'Bordeaux',
    seats: 4,
    power: 725,
    gearbox: 'Automatique',
    pricePerDay: 1150,
    deposit: 6500,
    rating: 4.91,
    reviews: 27,
    accent: 'blue',
    tagline: 'Le grand tourisme dans toute sa noblesse.',
    story:
      "Avaler 800 km de vignobles dans un fauteuil de cuir cousu main, bercé par un V12. La DBS ne court pas après le temps : elle le savoure.",
    specs: { '0-100': '3.4 s', vmax: '340 km/h', poids: '1693 kg' },
    options: ['Cuir bi-ton', 'Bang & Olufsen', 'Sellerie sur-mesure', 'Coffre 270 L'],
    instantBook: false,
    owner: { name: 'Aquitaine GT', verified: true, fleet: 6 },
    images: [
      { src: u('1618843479313-40f8afb4b4d8'), label: 'Profil' },
      { src: u('1605559424843-9e4c228bf1c2'), label: 'Détail' },
    ],
  },
  {
    id: 'f40-legende',
    brand: 'Ferrari',
    model: 'F40',
    year: 1990,
    category: 'youngtimer',
    city: 'Paris',
    seats: 2,
    power: 478,
    gearbox: 'Manuelle',
    pricePerDay: 4500,
    deposit: 40000,
    rating: 5.0,
    reviews: 4,
    accent: 'red',
    tagline: 'La dernière Ferrari signée Enzo.',
    story:
      "Pas d'ABS, pas d'assistance, juste deux turbos et votre courage. La F40 est un mythe roulant — celle que tous les enfants des années 90 avaient en poster.",
    specs: { '0-100': '4.1 s', vmax: '324 km/h', poids: '1100 kg' },
    options: ['Collector certifié', 'Transport fermé inclus', 'Accompagnement expert'],
    instantBook: false,
    owner: { name: 'Heritage Collection', verified: true, fleet: 3 },
    images: [
      { src: u('1611016186353-9af58c69a533'), label: 'Profil' },
      { src: u('1600712242805-5f78671b24da'), label: 'Détail' },
    ],
  },
  {
    id: 'revuelto-or',
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    category: 'hyper',
    city: 'Paris',
    seats: 2,
    power: 1015,
    gearbox: 'Double embrayage',
    pricePerDay: 3200,
    deposit: 25000,
    rating: 4.98,
    reviews: 12,
    accent: 'red',
    tagline: 'Le V12 hybride qui ouvre une nouvelle ère.',
    story:
      "1015 chevaux, trois moteurs électriques et le hurlement d'un V12 atmosphérique. Le Revuelto est le futur de Sant'Agata, sans renier une once de son passé.",
    specs: { '0-100': '2.5 s', vmax: '350 km/h', poids: '1772 kg' },
    options: ['Mode Città silencieux', 'Carbone forgé', 'Caméra embarquée', 'Livraison France'],
    instantBook: true,
    owner: { name: 'Maranello Prestige', verified: true, fleet: 12 },
    images: [
      { src: u('1617814076367-b759c7d7e738'), label: 'Profil' },
      { src: u('1621135802920-133df287f89c'), label: 'Avant' },
    ],
  },
]

export function getCar(id) {
  return CARS.find((c) => c.id === id)
}

export const formatEUR = (n) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n)

/* ---------- Galerie ----------
   En attendant la photothèque pro, chaque véhicule expose plusieurs « vues »
   rendues par CarVisual (cadrage/halo différents). Le 1er accent suit la marque,
   les suivants alternent pour créer du contraste visuel dans le carrousel. */
export const GALLERY_VIEWS = [
  { id: 'profil', label: 'Profil', view: 'profile' },
  { id: 'avant', label: 'Avant', view: 'front' },
  { id: 'arriere', label: '3/4 arrière', view: 'rear' },
  { id: 'detail', label: 'Détail', view: 'detail' },
]

export function getGallery(car) {
  // Photos réelles disponibles → galerie photo. Sinon, vues synthétiques signature.
  if (car.images?.length) {
    return car.images.map((img, i) => ({
      id: `${car.id}-${i}`,
      label: img.label ?? `Vue ${i + 1}`,
      src: img.src,
      accent: i % 2 === 0 ? car.accent : car.accent === 'red' ? 'blue' : 'red',
    }))
  }
  return GALLERY_VIEWS.map((v, i) => ({
    ...v,
    accent: i % 2 === 0 ? car.accent : car.accent === 'red' ? 'blue' : 'red',
  }))
}

/* Image principale d'un véhicule (carte, miniatures). */
export function getCover(car) {
  return car.images?.[0]?.src ?? null
}

/* ---------- Disponibilités ----------
   Plages réservées déterministes (démo) dérivées de l'id, à partir d'aujourd'hui.
   Remplacé par l'API /availability côté production. */
function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

const DAY = 86400000

export function getBookedRanges(carId, from = new Date()) {
  const h = hashStr(carId)
  const base = new Date(from)
  base.setHours(0, 0, 0, 0)
  const ranges = []
  // deux à trois plages réparties sur ~8 semaines
  const seeds = [
    { offset: 3 + (h % 5), len: 2 + (h % 3) },
    { offset: 16 + (h % 7), len: 3 + ((h >> 3) % 4) },
    { offset: 34 + (h % 9), len: 2 + ((h >> 5) % 3) },
  ]
  for (const s of seeds) {
    const start = new Date(base.getTime() + s.offset * DAY)
    const end = new Date(start.getTime() + s.len * DAY)
    ranges.push({ from: start, to: end })
  }
  return ranges
}

export function isDayBooked(date, ranges) {
  const t = new Date(date).setHours(0, 0, 0, 0)
  return ranges.some((r) => t >= new Date(r.from).setHours(0, 0, 0, 0) && t <= new Date(r.to).setHours(0, 0, 0, 0))
}
