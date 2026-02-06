import express from 'express'

import AnalyticController from '~/app/controllers/AnalyticController'
import { validate } from '~/app/middlewares/validate'
import verifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import { analyticsOverviewSchema } from '~/app/validators/api/analyticSchema'

const router = express.Router()

router.get('/overview', validate(analyticsOverviewSchema), verifyToken, verifyAdmin, AnalyticController.getOverview)

export default router
