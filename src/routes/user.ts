import express from 'express'

import PostController from '~/app/controllers/PostController'
import UserController from '~/app/controllers/UserController'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { paginationSchema } from '~/app/validators/api/commonSchema'
import { getUserPostsSchema } from '~/app/validators/api/posts'
import { getUserByNicknameSchema, updateCurrentUserSchema } from '~/app/validators/api/userSchema'

const router = express.Router()

router.get('/', validate(paginationSchema), verifyToken, UserController.getUsers)
router.get('/:id/posts', validate(getUserPostsSchema), PostController.getUserPosts)
router.patch('/me', validate(updateCurrentUserSchema), verifyToken, UserController.updateCurrentUser)
router.get('/:nickname', validate(getUserByNicknameSchema), UserController.getUserByNickname)

export default router
