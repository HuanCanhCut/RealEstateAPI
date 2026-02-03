import express from 'express'

import CloudinaryController from '~/app/controllers/CloudinaryController'
import { validate } from '~/app/middlewares/validate'
import { cloudinarySignatureSchema } from '~/app/validators/api/cloudinarySignatureSchema'

const router = express.Router()

router.post('/signature', validate(cloudinarySignatureSchema), CloudinaryController.createCloudinarySignature)

export default router
