/* Auth & KYC : la vérification ne démarre qu'après la découverte d'un véhicule. */
import { Router } from 'express'
import { store } from '../store.js'
import { createSession, attachDocument, evaluate, kycMode } from '../services/kyc.js'

const router = Router()

/** Crée (ou récupère) un utilisateur léger à partir d'un email. */
router.post('/register', async (req, res) => {
  const { email, phone, fullName } = req.body ?? {}
  if (!email) return res.status(400).json({ error: 'email requis' })
  let user = await store.users.findByEmail(email)
  if (!user) user = await store.users.create({ email, phone, fullName })
  res.json({ user })
})

/** Démarre une session KYC pour un utilisateur. */
router.post('/kyc/start', async (req, res) => {
  const { userId } = req.body ?? {}
  const user = await store.users.get(userId)
  if (!user) return res.status(404).json({ error: 'utilisateur introuvable' })
  const session = createSession(userId)
  await store.kyc.create(session)
  res.json({ session, mode: kycMode })
})

/** Soumet un élément du dossier (identity | licence | address | payment). */
router.post('/kyc/:id/document', async (req, res) => {
  const session = await store.kyc.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'session introuvable' })
  const { type, meta } = req.body ?? {}
  try {
    attachDocument(session, type, meta)
    await store.kyc.save(session)
    res.json({ session })
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message })
  }
})

/** Évalue le dossier et met à jour le statut de l'utilisateur. */
router.post('/kyc/:id/evaluate', async (req, res) => {
  const session = await store.kyc.get(req.params.id)
  if (!session) return res.status(404).json({ error: 'session introuvable' })
  const result = await evaluate(session)
  await store.kyc.save(session)
  await store.users.setKyc(session.userId, result.status)
  res.json({ result, session })
})

export default router
