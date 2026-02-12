import { Express, Request, Response } from 'express'

import analyticRoute from './analytic'
import authRoute from './auth'
import categoryRoute from './category'
import cloudinaryRoute from './cloudinary'
import commentRoute from './comment'
import postRoute from './post'
import userRoute from './user'
import errorHandler from '~/app/errors/errorHandler'
import setUserContextMiddleware from '~/app/middlewares/userContext'

const route = (app: Express) => {
    app.use('/api/auth', authRoute)
    app.use('/api/posts', postRoute)
    app.use('/api/users', userRoute)
    app.use('/api/categories', categoryRoute)
    app.use('/api/analytics', analyticRoute)
    app.use('/api/comments', commentRoute)
    app.use('/api/cloudinary', cloudinaryRoute)

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
