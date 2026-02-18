import { NextFunction, Response } from 'express'

import AnalyticService from '../services/AnalyticService'
import { IRequest } from '~/type'

class AnalyticController {
    getOverview = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const overview = await AnalyticService.getOverview({
                start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                end_date: new Date(Date.now()),
            })

            const previousOverview = await AnalyticService.getOverview({
                start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
                end_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            })

            res.json({
                data: {
                    ...overview,
                    previous_overview: previousOverview,
                },
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new AnalyticController()
