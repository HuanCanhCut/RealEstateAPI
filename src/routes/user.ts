import express from 'express'

import UserController from '~/app/controllers/UserController'
import { validate } from '~/app/middlewares/validate'
import verifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import { paginationSchema } from '~/app/validators/api/commonSchema'
import { getUserByNicknameSchema, updateCurrentUserSchema } from '~/app/validators/api/userSchema'

const router = express.Router()

router.get('/', validate(paginationSchema), verifyToken, UserController.getUsers)
router.get('/:nickname', validate(getUserByNicknameSchema), verifyToken, UserController.getUserByNickname)
router.patch('/me', validate(updateCurrentUserSchema), verifyToken, verifyAdmin, UserController.updateCurrentUser)

export default router
