/*
  Génération des documents de location (PDF).

  Pour chaque réservation, ASPHALT produit le dossier complet attendu par les
  deux parties :
   • contrat de location          (loueur ↔ locataire)
   • attestation d'assurance      (couverture de la location)
   • copie de la carte grise      (certificat d'immatriculation du véhicule)
   • conditions générales         (CGV / CGU de la location)

  Les PDF sont générés avec pdfkit (pur JS, aucune dépendance native) et écrits
  dans server/storage/documents/. Les métadonnées sont enregistrées via le store
  (Postgres en prod, mémoire en démo) puis exposées :
   • au loueur, dans l'onglet « Documents » de l'espace pro ;
   • au locataire, via des liens de téléchargement renvoyés à la réservation.
*/
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { nanoid } from 'nanoid'
import PDFDocument from 'pdfkit'
import { store, getCarById } from '../store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const STORAGE_DIR = path.join(__dirname, '..', 'storage', 'documents')
fs.mkdirSync(STORAGE_DIR, { recursive: true })

const RED = '#d11f33'
const INK = '#16161c'
const MUTE = '#6b6b76'
// Les espaces fines/insécables (U+202F, U+00A0) ne sont pas rendues par les
// polices standard de pdfkit : on les normalise en espace simple.
const EUR = (n) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
    .format(n ?? 0)
    .replace(/\s/g, " ")
const frDate = (d) => (d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—')

/* Plaque d'immatriculation factice mais déterministe (démo). */
function fakePlate(carId) {
  const h = [...carId].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)
  const L = 'ABCDEFGHJKLMNPRSTVWXYZ'
  // décalages non signés (>>>) : h peut dépasser 2^31 et rendre >> négatif.
  return `${L[h % 22]}${L[(h >>> 3) % 22]}-${100 + (h % 900)}-${L[(h >>> 7) % 22]}${L[(h >>> 9) % 22]}`
}

/* ------------------------------------------------------------- helpers PDF */
function header(doc, title, subtitle) {
  doc.fillColor(INK).fontSize(22).font('Helvetica-Bold').text('ASPHALT', { continued: true })
  doc.fillColor(RED).text(' .', { continued: false })
  doc.moveDown(0.1)
  doc.fillColor(MUTE).fontSize(8).font('Helvetica').text('LA MARKETPLACE DU SPORT-LUXE', { characterSpacing: 2 })
  doc.moveDown(1)
  doc.fillColor(RED).rect(doc.x, doc.y, 48, 3).fill()
  doc.moveDown(0.8)
  doc.fillColor(INK).fontSize(18).font('Helvetica-Bold').text(title)
  if (subtitle) doc.fillColor(MUTE).fontSize(10).font('Helvetica').text(subtitle)
  doc.moveDown(1)
}

function field(doc, label, value) {
  doc.fillColor(MUTE).fontSize(8).font('Helvetica').text(label.toUpperCase(), { characterSpacing: 1 })
  doc.fillColor(INK).fontSize(11).font('Helvetica-Bold').text(value ?? '—')
  doc.moveDown(0.6)
}

function twoCol(doc, left, right) {
  const y = doc.y
  const colW = (doc.page.width - doc.page.margins.left - doc.page.margins.right) / 2
  doc.fillColor(MUTE).fontSize(8).font('Helvetica').text(left.label.toUpperCase(), doc.page.margins.left, y, { width: colW, characterSpacing: 1 })
  doc.fillColor(INK).fontSize(11).font('Helvetica-Bold').text(left.value ?? '—', doc.page.margins.left, doc.y, { width: colW })
  const leftBottom = doc.y
  doc.fillColor(MUTE).fontSize(8).font('Helvetica').text(right.label.toUpperCase(), doc.page.margins.left + colW, y, { width: colW, characterSpacing: 1 })
  doc.fillColor(INK).fontSize(11).font('Helvetica-Bold').text(right.value ?? '—', doc.page.margins.left + colW, y + 11, { width: colW })
  doc.y = Math.max(leftBottom, doc.y)
  doc.moveDown(0.6)
}

function sectionTitle(doc, label) {
  doc.moveDown(0.4)
  doc.fillColor(RED).fontSize(11).font('Helvetica-Bold').text(label)
  doc.moveDown(0.4)
}

function paragraph(doc, text) {
  doc.fillColor(INK).fontSize(9.5).font('Helvetica').text(text, { align: 'justify', lineGap: 2 })
  doc.moveDown(0.5)
}

function footer(doc, ref) {
  const y = doc.page.height - 60
  doc.fillColor(MUTE).fontSize(7.5).font('Helvetica')
    .text(`Document ASPHALT · Réf. ${ref} · généré le ${frDate(Date.now())} · ceci est une démonstration produit`,
      doc.page.margins.left, y, { width: doc.page.width - doc.page.margins.left - doc.page.margins.right, align: 'center' })
}

/* Construit un PDF en mémoire et le renvoie en Buffer. */
function buildPdf(draw) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 56 })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
    draw(doc)
    doc.end()
  })
}

/* --------------------------------------------------------- les 4 documents */
function contractPdf(ctx) {
  return buildPdf((doc) => {
    header(doc, 'Contrat de location', `Référence ${ctx.ref}`)
    twoCol(doc, { label: 'Loueur', value: ctx.owner }, { label: 'Locataire', value: ctx.renter })
    twoCol(doc, { label: 'Véhicule', value: ctx.vehicle }, { label: 'Immatriculation', value: ctx.plate })
    twoCol(doc, { label: 'Début de location', value: frDate(ctx.start) }, { label: 'Fin de location', value: frDate(ctx.end) })
    twoCol(doc, { label: 'Durée', value: `${ctx.days} jour(s)` }, { label: 'Lieu', value: ctx.city })

    sectionTitle(doc, 'Conditions financières')
    field(doc, 'Tarif journalier', EUR(ctx.pricePerDay))
    twoCol(doc, { label: 'Sous-total', value: EUR(ctx.subtotal) }, { label: 'Frais de service', value: EUR(ctx.serviceFee) })
    twoCol(doc, { label: 'Total location', value: EUR(ctx.total) }, { label: 'Acompte (30 %)', value: EUR(ctx.deposit) })
    field(doc, 'Dépôt de garantie (caution, pré-autorisation)', EUR(ctx.caution))

    sectionTitle(doc, 'Engagements du locataire')
    paragraph(doc, "Le locataire s'engage à restituer le véhicule dans l'état où il l'a reçu, sinistre et usure anormale exclus. Il déclare détenir un permis de conduire valide et avoir satisfait à la vérification d'identité (KYC) requise par ASPHALT. Tout frais ultérieur (carburant, péages, contraventions, dommages) pourra être refacturé sur le moyen de paiement enregistré, conformément aux conditions générales.")
    sectionTitle(doc, 'Signatures')
    twoCol(doc, { label: 'Pour le loueur', value: '___________________' }, { label: 'Pour le locataire', value: '___________________' })
    footer(doc, ctx.ref)
  })
}

function insurancePdf(ctx) {
  return buildPdf((doc) => {
    header(doc, "Attestation d'assurance", 'Couverture de la location')
    paragraph(doc, "La présente atteste que le véhicule désigné ci-dessous bénéficie, pour la durée de la location, d'une couverture tous risques incluant responsabilité civile, vol, incendie et bris de glace, assortie d'une franchise correspondant au dépôt de garantie.")
    twoCol(doc, { label: 'Assuré (loueur)', value: ctx.owner }, { label: 'Conducteur autorisé', value: ctx.renter })
    twoCol(doc, { label: 'Véhicule', value: ctx.vehicle }, { label: 'Immatriculation', value: ctx.plate })
    twoCol(doc, { label: 'Validité du', value: frDate(ctx.start) }, { label: 'Au', value: frDate(ctx.end) })
    twoCol(doc, { label: 'N° de police', value: `ASPH-${ctx.ref}` }, { label: 'Franchise', value: EUR(ctx.caution) })
    sectionTitle(doc, 'Garanties incluses')
    paragraph(doc, "• Responsabilité civile illimitée\n• Vol & incendie\n• Dommages tous accidents\n• Bris de glace\n• Assistance 24/7 et véhicule de remplacement selon disponibilité")
    footer(doc, ctx.ref)
  })
}

function carteGrisePdf(ctx) {
  return buildPdf((doc) => {
    header(doc, "Certificat d'immatriculation", 'Copie — carte grise du véhicule')
    twoCol(doc, { label: 'A · Immatriculation', value: ctx.plate }, { label: 'B · 1re immatriculation', value: `01/01/${ctx.year}` })
    twoCol(doc, { label: 'D.1 · Marque', value: ctx.brand }, { label: 'D.3 · Dénomination', value: ctx.model })
    twoCol(doc, { label: 'P.6 · Puissance (ch)', value: String(ctx.power) }, { label: 'S.1 · Places assises', value: String(ctx.seats) })
    twoCol(doc, { label: 'Titulaire', value: ctx.owner }, { label: 'Énergie', value: 'Essence' })
    sectionTitle(doc, 'Mention')
    paragraph(doc, "Copie fournie au locataire pour la durée de la location, à présenter en cas de contrôle. L'original demeure la propriété du loueur. Document de démonstration produit ASPHALT.")
    footer(doc, ctx.ref)
  })
}

function termsPdf(ctx) {
  return buildPdf((doc) => {
    header(doc, 'Conditions générales', 'Conditions de la location')
    const clauses = [
      ['1. Objet', "Les présentes régissent la location du véhicule entre le loueur et le locataire via la plateforme ASPHALT, qui agit en qualité d'intermédiaire de mise en relation et de prestataire de paiement."],
      ['2. Dossier locataire', "La location est conditionnée à une vérification d'identité (KYC) validée : pièce d'identité, permis de conduire, justificatif de domicile et empreinte bancaire de solvabilité."],
      ['3. Acompte & caution', "Un acompte de 30 % bloque la réservation. Une caution est pré-autorisée (empreinte bancaire, sans débit) et libérée à la restitution si aucun dommage n'est constaté."],
      ['4. Restitution & frais', "Le véhicule est restitué aux date, heure et lieu convenus. Carburant, péages, contraventions et dommages éventuels sont refacturés sur le moyen de paiement enregistré."],
      ['5. Assurance', "La location est couverte par une assurance tous risques avec franchise égale au dépôt de garantie. Le conducteur déclaré est seul autorisé à conduire."],
      ['6. Annulation', "Les conditions d'annulation sont précisées lors de la réservation. ASPHALT facilite la médiation entre les parties en cas de litige."],
    ]
    for (const [t, body] of clauses) {
      sectionTitle(doc, t)
      paragraph(doc, body)
    }
    footer(doc, ctx.ref)
  })
}

const BUILDERS = {
  contract: { title: 'Contrat de location', audience: 'both', build: contractPdf },
  insurance: { title: "Attestation d'assurance", audience: 'both', build: insurancePdf },
  registration: { title: "Carte grise (copie)", audience: 'renter', build: carteGrisePdf },
  terms: { title: 'Conditions générales', audience: 'both', build: termsPdf },
}

/* Construit le contexte commun à tous les documents d'une réservation. */
function contextFor(booking, car) {
  const q = booking.quote ?? {}
  return {
    ref: booking.id.toUpperCase(),
    owner: car.owner?.name ?? 'Loueur ASPHALT',
    renter: booking.renterName ?? 'Locataire vérifié',
    vehicle: `${car.brand} ${car.model} (${car.year})`,
    brand: car.brand, model: car.model, year: car.year, power: car.power, seats: car.seats,
    plate: fakePlate(car.id),
    city: car.city,
    start: booking.start, end: booking.end, days: q.days ?? 1,
    pricePerDay: car.pricePerDay,
    subtotal: q.subtotal, serviceFee: q.serviceFee, total: q.total,
    deposit: q.deposit, caution: car.deposit,
  }
}

/**
  Génère les 4 documents d'une réservation, les écrit sur disque et enregistre
  leurs métadonnées dans le store. Idempotent : ne régénère pas si déjà présents.
*/
export async function generateForBooking(booking) {
  const car = getCarById(booking.carId)
  if (!car) throw new Error('véhicule introuvable')

  const existing = await store.documents.listByBooking(booking.id)
  if (existing.length) return existing

  const ctx = contextFor(booking, car)
  const created = []
  for (const [kind, def] of Object.entries(BUILDERS)) {
    const buf = await def.build(ctx)
    const id = nanoid(12)
    const filename = `${booking.id}_${kind}.pdf`
    fs.writeFileSync(path.join(STORAGE_DIR, filename), buf)
    const doc = await store.documents.create({
      id, bookingId: booking.id, kind, title: def.title, filename, audience: def.audience,
    })
    created.push(doc)
  }
  return created
}

/** Renvoie le chemin disque d'un document (pour le téléchargement). */
export function filePath(filename) {
  return path.join(STORAGE_DIR, filename)
}
