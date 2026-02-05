import { z } from 'zod'

import { TypedRequest } from '~/types/request'

export const getUserByNicknameSchema = z.object({
    params: z.object({
        nickname: z.string().min(1),
    }),
})

export type GetUserByNicknameRequest = TypedRequest<any, z.infer<typeof getUserByNicknameSchema>['params']>
