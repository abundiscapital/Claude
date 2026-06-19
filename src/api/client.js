/*
  Client API ASPHALT.
  Dégradation gracieuse : si l'API n'est pas joignable (SPA lancé seul), les
  appels rejettent proprement et l'UI conserve son comportement de démonstration.
*/
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw Object.assign(new Error(data.error ?? `HTTP ${res.status}`), { status: res.status, data })
  }
  return res.json()
}

export const api = {
  health: () => req('/health'),

  // auth & kyc
  register: (email, phone) => req('/auth/register', { method: 'POST', body: { email, phone } }),
  startKyc: (userId) => req('/auth/kyc/start', { method: 'POST', body: { userId } }),
  submitDoc: (sessionId, type, meta) =>
    req(`/auth/kyc/${sessionId}/document`, { method: 'POST', body: { type, meta } }),
  evaluateKyc: (sessionId) => req(`/auth/kyc/${sessionId}/evaluate`, { method: 'POST' }),

  // bookings
  quote: (carId, start, end) => req('/bookings/quote', { method: 'POST', body: { carId, start, end } }),
  book: (payload) => req('/bookings', { method: 'POST', body: payload }),
  chargeExtra: (bookingId, amountEur, reason) =>
    req(`/bookings/${bookingId}/charge-extra`, { method: 'POST', body: { amountEur, reason } }),

  // documents de location (contrat, assurance, carte grise, conditions)
  bookings: () => req('/bookings'),
  documents: (bookingId) => req(`/bookings/${bookingId}/documents`),
  documentUrl: (docId) => `${BASE}/bookings/documents/${docId}/download`,

  // availability
  availability: (carId) => req(`/availability/${carId}`),
  blockDay: (carId, day, blocked) =>
    req(`/availability/${carId}/block`, { method: 'POST', body: { day, blocked } }),

  // ecosystem
  partners: (type) => req(`/ecosystem/partners${type ? `?type=${type}` : ''}`),
  applyPartner: (payload) => req('/ecosystem/apply', { method: 'POST', body: payload }),

  // messages
  thread: (threadId) => req(`/messages/${threadId}`),
  send: (threadId, from, text) => req(`/messages/${threadId}`, { method: 'POST', body: { from, text } }),
}
