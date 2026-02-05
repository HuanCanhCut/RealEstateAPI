import { z } from 'zod'

import { TypedRequest } from '~/types/request'

export const getUserByNicknameSchema = z.object({
    params: z.object({
        nickname: z.string().min(1),
    }),
})

export const updateCurrentUserSchema = z.object({
    body: z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        avatar: z.url().optional(),
        address: z.string().min(1).optional(),
        phone_number: z.string().optional(),
    }),
})

export type GetUserByNicknameRequest = TypedRequest<any, z.infer<typeof getUserByNicknameSchema>['params']>
export type UpdateCurrentUserRequest = TypedRequest<z.infer<typeof updateCurrentUserSchema>['body']>
