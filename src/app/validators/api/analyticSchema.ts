import { z } from 'zod'

import { TypedRequest } from '~/types/request'

export const analyticsOverviewSchema = z.object({
    body: z
        .object({
            start_date: z
                .date()
                .optional()
                .default(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
            end_date: z.date().optional().default(new Date()),
        })
        .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
            message: 'end_date phải lớn hơn start_date',
            path: ['end_date'],
        }),
})

export type AnalyticsOverviewRequest = TypedRequest<z.infer<typeof analyticsOverviewSchema>['body']>
