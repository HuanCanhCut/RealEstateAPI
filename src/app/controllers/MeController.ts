import { NextFunction, Response } from 'express'

import MeService from '../services/MeService'
import { IRequest } from '~/type'

class MeController {
    getCurrentUser = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const decoded = req.decoded

            const currentUser = await MeService.getUserById(decoded.sub)

            res.json({
                data: currentUser,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new MeController()
