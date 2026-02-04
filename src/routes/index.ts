import { Express, Request, Response } from 'express'

import authRoute from './auth'
import postRoute from './post'
import errorHandler from '~/app/errors/errorHandler'
import setUserContextMiddleware from '~/app/middlewares/userContext'

const route = (app: Express) => {
    app.use('/api/auth', authRoute)
    app.use('/api/posts', postRoute)

    app.all('*', (req: Request, res: Response) => {
        res.status(404).json({
            status: 404,
            message: `Can't find ${req.originalUrl} on this server!`,
        })
    })

    app.use(setUserContextMiddleware)

    app.use(errorHandler)
}

export default route
