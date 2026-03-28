import express from 'express'
import cors from 'cors'
import predictRoutes from './routes/predict.js'
import spaceBasesRoutes from './routes/spaceBases.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/predict', predictRoutes)
app.use('/space-bases', spaceBasesRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

app.listen(PORT, () => {
  console.log(`COSMOS API http://localhost:${PORT}`)
})
