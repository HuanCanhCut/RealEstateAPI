import { z } from 'zod'

import { TypedRequest } from '~/types/request'

export const getCommentsSchema = z.object({
    query: z.object({
        limit: z.coerce.number().min(1).transform(String),
        offset: z.coerce.number().min(0).transform(String),
        post_id: z.coerce.number().int().transform(String),
        parent_id: z.coerce.number().int().transform(String).optional(),
    }),
})

export type GetCommentsRequest = TypedRequest<any, any, z.infer<typeof getCommentsSchema>['query']>
