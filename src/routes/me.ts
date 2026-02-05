import express from 'express'

import MeController from '~/app/controllers/MeController'
import verifyToken from '~/app/middlewares/verifyToken'

const router = express.Router()

router.get('/', verifyToken, MeController.getCurrentUser)

export default router
