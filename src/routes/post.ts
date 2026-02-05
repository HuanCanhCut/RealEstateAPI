import express from 'express'

import PostController from '~/app/controllers/PostController'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { paginationSchema } from '~/app/validators/api/commonSchema'
import { createPostSchema, updatePostSchema } from '~/app/validators/api/posts'

const router = express.Router()

router.post('/', validate(createPostSchema), verifyToken, PostController.createPost)
router.get('/', validate(paginationSchema), PostController.getPosts)
router.put('/:postId', validate(updatePostSchema), verifyToken, PostController.updatePost)

export default router
