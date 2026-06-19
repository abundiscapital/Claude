/* Écosystème : annuaire des partenaires + candidature (compte connecté Stripe). */
import { Router } from 'express'
import { nanoid } from 'nanoid'
import { db } from '../store.js'
import { createConnectedAccount } from '../services/payments.js'

const router = Router()

// annuaire seed (aligné avec le front)
const PARTNERS = [
  { id: 'p1', name: 'Maranello Service', type: 'garage', city: 'Paris', rating: 4.9 },
  { id: 'p2', name: 'Atelier Carbone', type: 'body', city: 'Lyon', rating: 4.8 },
  { id: 'p3', name: 'Prestige Detailing', type: 'clean', city: 'Cannes', rating: 5.0 },
  { id: 'p4', name: 'AXA Mobility Lux', type: 'insurance', city: 'National', rating: 4.7 },
  { id: 'p5', name: 'Riviera Motors', type: 'dealer', city: 'Monaco', rating: 4.9 },
]

router.get('/partners', (req, res) => {
  const { type } = req.query
  const list = type && type !== 'all' ? PARTNERS.filter((p) => p.type === type) : PARTNERS
  res.json({ partners: list })
})

/** Candidature partenaire : crée un compte connecté pour les reversements. */
router.post('/apply', async (req, res) => {
  const { businessName, email, type } = req.body ?? {}
  if (!businessName || !email || !type) {
    return res.status(400).json({ error: 'raison sociale, email et type requis' })
  }
  const account = await createConnectedAccount({ email, businessName })
  const application = {
    id: nanoid(10), businessName, email, type, status: 'reviewing',
    stripeAccountId: account.id, createdAt: Date.now(),
  }
  res.status(201).json({ application, onboardingUrl: account.onboardingUrl })
})

export default router
