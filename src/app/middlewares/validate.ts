// middlewares/validate.middleware.ts
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { z } from 'zod'

import { InternalServerError, UnprocessableEntityError } from '../errors/errors'

export const validate = (schema: z.ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = (await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            })) as {
                body: any
                query: any
                params: any
            }

            req.body = parsed.body
            req.query = parsed.query
            req.params = parsed.params

            next()
        } catch (error) {
            if (error instanceof ZodError) {
                // Format errors cho frontend dễ đọc
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                    code: issue.code,
                }))

                next(
                    new UnprocessableEntityError({
                        message: 'Validation failed',
                        error: errors,
                    }),
                )
                return
            }

            next(
                new InternalServerError({
                    message: 'Validation error',
                    error,
                }),
            )
        }
    }
}
