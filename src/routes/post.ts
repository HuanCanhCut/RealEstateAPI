import express from 'express'

import PostController from '~/app/controllers/PostController'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { idSchema } from '~/app/validators/api/commonSchema'
import { createPostSchema, getPostsSchema, searchPostsSchema, updatePostSchema } from '~/app/validators/api/posts'

const router = express.Router()

router.get('/', validate(getPostsSchema), PostController.getPosts)
router.get('/search', validate(searchPostsSchema), PostController.searchPosts)
router.get('/:id', validate(idSchema), PostController.getPostById)
router.post('/', validate(createPostSchema), verifyToken, PostController.createPost)
router.put('/:postId', validate(updatePostSchema), verifyToken, PostController.updatePost)
router.delete('/:id', validate(idSchema), verifyToken, PostController.deletePost)
router.post('/:id/like', validate(idSchema), verifyToken, PostController.likePost)
router.post('/:id/unlike', validate(idSchema), verifyToken, PostController.unlikePost)

export default router
