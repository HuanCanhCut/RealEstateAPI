import express from 'express'

import MeController from '~/app/controllers/MeController'
import UserController from '~/app/controllers/UserController'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { getUserByNicknameSchema, updateCurrentUserSchema } from '~/app/validators/api/userSchema'

const router = express.Router()

router.get('/me', verifyToken, MeController.getCurrentUser)
router.get('/:nickname', validate(getUserByNicknameSchema), verifyToken, UserController.getUserByNickname)
router.patch('/me', validate(updateCurrentUserSchema), verifyToken, UserController.updateCurrentUser)

export default router
