import { NextFunction } from 'express'

import { AppError, ForBiddenError, InternalServerError } from '../errors/errors'
import { User } from '../models'
import { IRequest } from '~/type'

const verifyAdmin = async (req: IRequest, res: any, next: NextFunction) => {
    try {
        const decoded = req.decoded

        const user = await User.findByPk(decoded.sub)

        if (user?.role !== 'admin') {
            throw new ForBiddenError({ message: 'You are not authorized to access this resource' })
        }

        next()
    } catch (e: any) {
        if (e instanceof AppError) {
            return next(e)
        }

        return next(new InternalServerError({ message: e.message + ' ' + e.stack }))
    }
}

export default verifyAdmin
