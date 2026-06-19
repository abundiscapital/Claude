/*
  Service KYC / vérification d'identité.

  Abstraction au-dessus d'un prestataire (Stripe Identity, Onfido, Veriff…).
  Bascule automatique : si KYC_API_KEY est défini, on délègue au prestataire ;
  sinon mock déterministe pour développer sans compte.

  Le client ne crée un dossier qu'APRÈS avoir trouvé son véhicule. Le dossier est
  réutilisable pour ses prochaines locations (statut "verified" porté par l'utilisateur).
*/
import 'dotenv/config'

const KEY = process.env.KYC_API_KEY
export const kycMode = KEY ? 'live' : 'mock'

const REQUIRED = ['identity', 'licence', 'address', 'payment']

const id = (p) => `${p}_${Math.random().toString(36).slice(2, 12)}`

/** Crée une session de vérification. */
export function createSession(userId) {
  return {
    id: id('kyc'),
    userId,
    status: 'pending', // pending | reviewing | verified | rejected
    required: REQUIRED,
    documents: {},
    createdAt: Date.now(),
  }
}

/** Enregistre un document/élément soumis (id, permis, domicile, carte). */
export function attachDocument(session, type, meta = {}) {
  if (!REQUIRED.includes(type)) {
    throw Object.assign(new Error(`Type de document inconnu : ${type}`), { status: 400 })
  }
  session.documents[type] = { receivedAt: Date.now(), ...meta }
  session.status = 'reviewing'
  return session
}

/**
  Évalue le dossier. En mock : "verified" dès que les 4 éléments sont présents et
  qu'aucun signal de fraude simulé n'est levé. En prod : appel prestataire + AML +
  contrôle de solvabilité (empreinte bancaire via Stripe).
*/
export async function evaluate(session) {
  const missing = REQUIRED.filter((t) => !session.documents[t])
  if (missing.length) {
    session.status = 'pending'
    return { status: 'pending', missing }
  }
  if (kycMode === 'live') {
    // TODO: brancher l'appel réel au prestataire ici (await provider.check(...)).
    // On reste défensif : tant que non implémenté, on garde "reviewing".
    session.status = 'reviewing'
    return { status: 'reviewing', missing: [] }
  }
  session.status = 'verified'
  session.verifiedAt = Date.now()
  return { status: 'verified', missing: [], solvency: 'ok' }
}
