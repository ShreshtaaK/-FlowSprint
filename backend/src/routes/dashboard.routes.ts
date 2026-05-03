import { Router } from 'express'
import {
  getDashboardStats,
  getAnalytics
} from '../controllers/dashboard.controller'
import { protect } from '../middleware/auth.middleware'

const router = Router()

router.use(protect)

router.get('/stats', getDashboardStats)
router.get('/analytics', getAnalytics)

export default router