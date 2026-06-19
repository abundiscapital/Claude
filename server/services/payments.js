/*
  Service paiements — modèle Stripe Connect.

  Bascule automatique :
   - si STRIPE_SECRET_KEY est défini → vrais appels Stripe (destination charges,
     acomptes, caution en pré-autorisation, refacturation off-session, virements
     aux loueurs via comptes connectés).
   - sinon → mock déterministe, pour développer sans clé.

  Flux couverts (cf. README) :
   - acompte 30 % pour bloquer la réservation (capture immédiate),
   - caution = empreinte bancaire (autorisation sans capture),
   - solde à la prise du véhicule,
   - refacturation de frais ultérieurs (carburant, péages, dommages) off-session,
   - reversement au loueur (commission ASPHALT déduite).
*/
import 'dotenv/config'

const KEY = process.env.STRIPE_SECRET_KEY
const PLATFORM_FEE = Number(process.env.ASPHALT_FEE_PCT ?? 0.1) // 10 %

let stripe = null
if (KEY) {
  const Stripe = (await import('stripe')).default
  stripe = new Stripe(KEY)
}

export const paymentsMode = stripe ? 'live' : 'mock'

const mockId = (p) => `${p}_${Math.random().toString(36).slice(2, 12)}`
const cents = (eur) => Math.round(eur * 100)

/** Acompte (capture immédiate) pour bloquer la réservation. */
export async function createDeposit({ amountEur, ownerAccountId, bookingId, customerId }) {
  const amount = cents(amountEur)
  const fee = Math.round(amount * PLATFORM_FEE)
  if (!stripe) {
    return { id: mockId('pi_deposit'), status: 'succeeded', amount, applicationFee: fee, mode: 'mock' }
  }
  const pi = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    customer: customerId,
    confirm: true,
    application_fee_amount: fee,
    transfer_data: ownerAccountId ? { destination: ownerAccountId } : undefined,
    metadata: { bookingId, kind: 'deposit' },
  })
  return { id: pi.id, status: pi.status, amount, applicationFee: fee, mode: 'live' }
}

/** Caution : autorisation sans capture (empreinte bancaire). */
export async function authorizeCaution({ amountEur, bookingId, customerId, paymentMethodId }) {
  const amount = cents(amountEur)
  if (!stripe) {
    return { id: mockId('pi_hold'), status: 'requires_capture', amount, mode: 'mock' }
  }
  const pi = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    customer: customerId,
    payment_method: paymentMethodId,
    capture_method: 'manual',
    confirm: true,
    metadata: { bookingId, kind: 'caution' },
  })
  return { id: pi.id, status: pi.status, amount, mode: 'live' }
}

/** Libère la caution (aucun dommage). */
export async function releaseCaution(paymentIntentId) {
  if (!stripe) return { id: paymentIntentId, status: 'canceled', mode: 'mock' }
  const pi = await stripe.paymentIntents.cancel(paymentIntentId)
  return { id: pi.id, status: pi.status, mode: 'live' }
}

/** Refacturation de frais ultérieurs (off-session, sur la carte enregistrée). */
export async function chargeExtra({ amountEur, reason, bookingId, customerId, paymentMethodId, ownerAccountId }) {
  const amount = cents(amountEur)
  const fee = Math.round(amount * PLATFORM_FEE)
  if (!stripe) {
    return { id: mockId('pi_extra'), status: 'succeeded', amount, reason, mode: 'mock' }
  }
  const pi = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    customer: customerId,
    payment_method: paymentMethodId,
    off_session: true,
    confirm: true,
    application_fee_amount: fee,
    transfer_data: ownerAccountId ? { destination: ownerAccountId } : undefined,
    metadata: { bookingId, kind: 'extra', reason },
  })
  return { id: pi.id, status: pi.status, amount, reason, mode: 'live' }
}

/** Onboarding d'un loueur : compte connecté + lien d'activation. */
export async function createConnectedAccount({ email, businessName }) {
  if (!stripe) {
    return { id: mockId('acct'), onboardingUrl: `https://connect.asphalt.example/onboard/${mockId('s')}`, mode: 'mock' }
  }
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    business_profile: { name: businessName },
    capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
  })
  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.APP_URL ?? 'http://localhost:5173'}/pro?onboarding=refresh`,
    return_url: `${process.env.APP_URL ?? 'http://localhost:5173'}/pro?onboarding=done`,
    type: 'account_onboarding',
  })
  return { id: account.id, onboardingUrl: link.url, mode: 'live' }
}
