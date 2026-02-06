import { NextFunction, Response } from 'express'

import { PaginationRequest } from '../validators/api/commonSchema'

class AnalyticController {
    getOverview = async (req: PaginationRequest, res: Response, next: NextFunction) => {
        try {
            //
        } catch (error) {
            return next(error)
        }
    }
}

export default new AnalyticController()
