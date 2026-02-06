import express from 'express'

import CategoryController from '~/app/controllers/CategoryController'
import { validate } from '~/app/middlewares/validate'
import verifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import { createCategorySchema, updateCategorySchema } from '~/app/validators/api/categorySchema'
import { idSchema, paginationSchema } from '~/app/validators/api/commonSchema'

const router = express.Router()

router.get('/', validate(paginationSchema), CategoryController.getCategories)
router.post('/', verifyToken, verifyAdmin, validate(createCategorySchema), CategoryController.createCategory)
router.patch('/:id', verifyToken, verifyAdmin, validate(updateCategorySchema), CategoryController.updateCategory)
router.delete('/:id', verifyToken, verifyAdmin, validate(idSchema), CategoryController.deleteCategory)

export default router
