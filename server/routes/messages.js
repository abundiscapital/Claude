/* Messagerie client ↔ loueur (persistée via le store). */
import { Router } from 'express'
import { store } from '../store.js'

const router = Router()

const toWire = (m) => ({ id: m.id, threadId: m.threadId, from: m.sender, text: m.body, at: m.createdAt })

router.get('/:threadId', async (req, res) => {
  const messages = await store.messages.list(req.params.threadId)
  res.json({ threadId: req.params.threadId, messages: messages.map(toWire) })
})

router.post('/:threadId', async (req, res) => {
  const { from, text } = req.body ?? {}
  if (!text) return res.status(400).json({ error: 'texte requis' })
  const msg = await store.messages.add({ threadId: req.params.threadId, sender: from ?? 'me', body: text })
  res.status(201).json({ message: toWire(msg) })
})

export default router
