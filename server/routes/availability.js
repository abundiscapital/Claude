/* Disponibilités : lecture publique, gestion des indisponibilités côté loueur. */
import { Router } from 'express'
import { store, getCarById } from '../store.js'

const router = Router()

/** Plages réservées + jours bloqués d'un véhicule. */
router.get('/:carId', async (req, res) => {
  const car = getCarById(req.params.carId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  const a = await store.availability.get(car.id)
  res.json({ carId: car.id, booked: a.booked, blocked: a.blocked })
})

/** Bloque/débloque un jour (garage, entretien, usage perso). */
router.post('/:carId/block', async (req, res) => {
  const car = getCarById(req.params.carId)
  if (!car) return res.status(404).json({ error: 'véhicule introuvable' })
  const { day, blocked } = req.body ?? {}
  if (!day) return res.status(400).json({ error: 'jour (YYYY-MM-DD) requis' })
  const list = await store.availability.setBlock(car.id, day, blocked !== false)
  res.json({ carId: car.id, blocked: list })
})

export default router
