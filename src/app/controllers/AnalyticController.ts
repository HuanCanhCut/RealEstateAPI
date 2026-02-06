import { NextFunction, Response } from 'express'

import AnalyticService from '../services/AnalyticService'
import { AnalyticsOverviewRequest } from '../validators/api/analyticSchema'

class AnalyticController {
    getOverview = async (req: AnalyticsOverviewRequest, res: Response, next: NextFunction) => {
        try {
            const { start_date, end_date } = req.body

            const overview = await AnalyticService.getOverview({
                start_date: new Date(start_date),
                end_date: new Date(end_date),
            })

            res.json({
                data: overview,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new AnalyticController()
