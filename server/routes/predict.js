import { Router } from 'express'
import { predict } from '../controllers/predictController.js'

const router = Router()
router.post('/', predict)

export default router
