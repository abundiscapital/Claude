/* Disponibilités : lecture publique, gestion des indisponibilités côté loueur. */
import { Router } from 'express'
import { db, getCarById } from '../store.js'

const router = Router()

/** Plages réservées + jours bloqués d'un véhicule. */
router.get('/:carId', (req, res) => {
  const car = getCarById(req.params.carId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  const a = db.availability.get(car.id)
  res.json({ carId: car.id, booked: a.booked, blocked: [...a.blocked] })
})

/** Bloque/débloque un jour (garage, entretien, usage perso). */
router.post('/:carId/block', (req, res) => {
  const a = db.availability.get(req.params.carId)
  if (!a) return res.status(404).json({ error: 'véhicule introuvable' })
  const { day, blocked } = req.body ?? {}
  if (!day) return res.status(400).json({ error: 'jour (YYYY-MM-DD) requis' })
  if (blocked === false) a.blocked.delete(day)
  else a.blocked.add(day)
  res.json({ carId: req.params.carId, blocked: [...a.blocked] })
})

export default router
