/* Auth & KYC : la vérification ne démarre qu'après la découverte d'un véhicule. */
import { Router } from 'express'
import { nanoid } from 'nanoid'
import { db } from '../store.js'
import { createSession, attachDocument, evaluate, kycMode } from '../services/kyc.js'

const router = Router()

/** Crée (ou récupère) un utilisateur léger à partir d'un email. */
router.post('/register', (req, res) => {
  const { email, phone } = req.body ?? {}
  if (!email) return res.status(400).json({ error: 'email requis' })
  let user = [...db.users.values()].find((u) => u.email === email)
  if (!user) {
    user = { id: nanoid(10), email, phone, kycStatus: 'none', createdAt: Date.now() }
    db.users.set(user.id, user)
  }
  res.json({ user })
})

/** Démarre une session KYC pour un utilisateur. */
router.post('/kyc/start', (req, res) => {
  const { userId } = req.body ?? {}
  const user = db.users.get(userId)
  if (!user) return res.status(404).json({ error: 'utilisateur introuvable' })
  const session = createSession(userId)
  db.kycSessions.set(session.id, session)
  res.json({ session, mode: kycMode })
})

/** Soumet un élément du dossier (identity | licence | address | payment). */
router.post('/kyc/:id/document', (req, res) => {
  const session = db.kycSessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'session introuvable' })
  const { type, meta } = req.body ?? {}
  try {
    attachDocument(session, type, meta)
    res.json({ session })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

/** Évalue le dossier et met à jour le statut de l'utilisateur. */
router.post('/kyc/:id/evaluate', async (req, res) => {
  const session = db.kycSessions.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'session introuvable' })
  const result = await evaluate(session)
  const user = db.users.get(session.userId)
  if (user) user.kycStatus = result.status
  res.json({ result, session })
})

export default router
