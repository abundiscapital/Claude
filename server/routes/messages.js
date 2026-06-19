/* Messagerie client ↔ loueur (démo : fil en mémoire). */
import { Router } from 'express'
import { nanoid } from 'nanoid'
import { db } from '../store.js'

const router = Router()

router.get('/:threadId', (req, res) => {
  const messages = db.messages.filter((m) => m.threadId === req.params.threadId)
  res.json({ threadId: req.params.threadId, messages })
})

router.post('/:threadId', (req, res) => {
  const { from, text } = req.body ?? {}
  if (!text) return res.status(400).json({ error: 'texte requis' })
  const msg = {
    id: nanoid(8), threadId: req.params.threadId, from: from ?? 'me', text, at: Date.now(),
  }
  db.messages.push(msg)
  res.status(201).json({ message: msg })
})

export default router
