import express from 'express'

import AnalyticController from '~/app/controllers/AnalyticController'
import { validate } from '~/app/middlewares/validate'
import verifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import { paginationSchema } from '~/app/validators/api/commonSchema'

const router = express.Router()

router.get('/', validate(paginationSchema), verifyToken, verifyAdmin, AnalyticController.getOverview)

export default router
