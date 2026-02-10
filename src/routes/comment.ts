import express from 'express'

import CommentController from '~/app/controllers/CommentController'
import { validate } from '~/app/middlewares/validate'
import { getCommentsSchema } from '~/app/validators/api/commentSchema'

const router = express.Router()

router.get('/', validate(getCommentsSchema), CommentController.getComments)

export default router
