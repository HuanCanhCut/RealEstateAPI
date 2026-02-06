import express from 'express'
const router = express.Router()

import AuthController from '../app/controllers/AuthController'
import { validate } from '../app/middlewares/validate'
import {
    loginSchema,
    loginWithTokenSchema,
    registerSchema,
    resetPassSchema,
    sendResetPassCodeSchema,
    sendVerifyCodeSchema,
    verifyAccountSchema,
    verifyAuthChallengeIdSchema,
} from '../app/validators/api/authSchema'
import MeController from '~/app/controllers/MeController'
import verifyToken from '~/app/middlewares/verifyToken'

router.get('/me', verifyToken, MeController.getCurrentUser)
router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/loginwithtoken', validate(loginWithTokenSchema), AuthController.loginWithToken)
router.get('/refresh', AuthController.refreshToken)
router.post('/verification/send', validate(sendVerifyCodeSchema), AuthController.sendVerifyCode)
router.post('/verification/verify', validate(verifyAccountSchema), AuthController.verifyAccount)
router.get(
    '/verification/challenge/:auth_challenge_id',
    validate(verifyAuthChallengeIdSchema),
    AuthController.verifyAuthChallengeId,
)
router.post('/forgot-password', validate(sendResetPassCodeSchema), AuthController.sendResetPassCode)
router.post('/reset-password', validate(resetPassSchema), AuthController.resetPassword)

export default router
