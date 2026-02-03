import { z } from 'zod'

import { emailSchema } from './commonSchema'
import { TypedRequest } from '~/types/request'

const passwordSchema = z.string().min(6)

export const registerSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
    }),
})

export const loginSchema = registerSchema.extend({})

export const loginWithTokenSchema = z.object({
    body: z.object({
        token: z.string().trim(),
    }),
})

export const sendVerifyCodeSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
})

export const sendResetPassCodeSchema = sendVerifyCodeSchema.extend({})

export const resetPassSchema = z.object({
    body: z.object({
        email: emailSchema,
        code: z.string().trim().length(6),
        password: passwordSchema,
    }),
})

export const verifyAccountSchema = z.object({
    body: z.object({
        email: emailSchema,
        code: z.string().trim().length(6),
    }),
})

export const verifyAuthChallengeIdSchema = z.object({
    params: z.object({
        auth_challenge_id: z.uuidv4(),
    }),
    query: z.object({
        email: emailSchema,
    }),
})

export type RegisterRequest = TypedRequest<z.infer<typeof registerSchema>['body']>
export type LoginRequest = TypedRequest<z.infer<typeof loginSchema>['body']>
export type LoginWithTokenRequest = TypedRequest<z.infer<typeof loginWithTokenSchema>['body']>
export type SendVerifyCodeRequest = TypedRequest<z.infer<typeof sendVerifyCodeSchema>['body']>
export type SendResetPassCodeRequest = TypedRequest<z.infer<typeof sendResetPassCodeSchema>['body']>
export type ResetPassRequest = TypedRequest<z.infer<typeof resetPassSchema>['body']>
export type VerifyAccountRequest = TypedRequest<z.infer<typeof verifyAccountSchema>['body']>

export type VerifyAuthChallengeIdRequest = TypedRequest<
    any,
    z.infer<typeof verifyAuthChallengeIdSchema>['params'],
    z.infer<typeof verifyAuthChallengeIdSchema>['query']
>
