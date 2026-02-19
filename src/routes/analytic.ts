import express from 'express'

import AnalyticController from '~/app/controllers/AnalyticController'
import verifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'

const router = express.Router()

router.get('/overview', verifyToken, verifyAdmin, AnalyticController.getOverview)
router.get('/users/monthly-registrations', verifyToken, verifyAdmin, AnalyticController.getMonthlyRegistrations)

export default router
