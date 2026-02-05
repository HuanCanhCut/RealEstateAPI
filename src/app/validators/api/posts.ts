import { z } from 'zod'

import { TypedRequest } from '~/types/request'

export const createPostSchema = z.object({
    body: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        administrative_address: z.string().min(1),
        sub_locality: z.string().min(1),
        type: z.enum(['sell', 'rent']),
        images: z.array(z.url()),
        category_id: z.number(),
        role: z.enum(['user', 'agent']),

        post_detail: z.object({
            bedrooms: z.number(),
            bathrooms: z.number(),
            balcony: z.string().min(1),
            main_door: z.string().min(1),
            legal_documents: z.string().min(1),
            interior_status: z.string().min(1),
            area: z.number(),
            price: z.number(),
            deposit: z.number(),
        }),
    }),
})

export const updatePostSchema = z.object({
    body: createPostSchema.shape.body,
    params: z.object({
        postId: z.coerce.number().int().positive().transform(String),
    }),
})

export type CreatePostRequest = TypedRequest<z.infer<typeof createPostSchema>['body']>
export type UpdatePostRequest = TypedRequest<
    z.infer<typeof updatePostSchema>['body'],
    z.infer<typeof updatePostSchema>['params']
>
