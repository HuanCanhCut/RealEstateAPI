import { z } from 'zod'

import { idSchema } from './commonSchema'
import { TypedRequest } from '~/types/request'

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1),
    }),
})

export const updateCategorySchema = z.object({
    body: createCategorySchema.shape.body,
    params: idSchema.shape.params,
})

export type CreateCategoryRequest = TypedRequest<z.infer<typeof createCategorySchema>['body']>
export type UpdateCategoryRequest = TypedRequest<
    z.infer<typeof updateCategorySchema>['body'],
    z.infer<typeof updateCategorySchema>['params']
>
