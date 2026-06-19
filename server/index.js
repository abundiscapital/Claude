/*
  API ASPHALT — Express.
  Mock-capable : tourne sans aucune clé. Renseignez STRIPE_SECRET_KEY et/ou
  KYC_API_KEY (voir .env.example) pour passer en mode réel sans changer de code.
*/
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/bookings.js'
import availabilityRoutes from './routes/availability.js'
import ecosystemRoutes from './routes/ecosystem.js'
import messageRoutes from './routes/messages.js'
import { paymentsMode } from './services/payments.js'
import { kycMode } from './services/kyc.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'asphalt-api', modes: { payments: paymentsMode, kyc: kycMode } })
})

app.use('/api/auth', authRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/availability', availabilityRoutes)
app.use('/api/ecosystem', ecosystemRoutes)
app.use('/api/messages', messageRoutes)

app.use((req, res) => res.status(404).json({ error: 'route inconnue' }))

const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => {
  console.log(`ASPHALT API → http://localhost:${PORT}`)
  console.log(`  paiements: ${paymentsMode} · kyc: ${kycMode}`)
})

export default app
