import { Router } from 'express'
import { listSpaceBases } from '../controllers/spaceBasesController.js'

const router = Router()
router.get('/', listSpaceBases)

export default router
