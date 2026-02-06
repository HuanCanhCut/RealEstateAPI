import { col, fn, literal, Op } from 'sequelize'

import { AppError, InternalServerError } from '../errors/errors'
import { Post, User } from '../models'

class AnalyticService {
    getOverview = async ({ start_date, end_date }: { start_date: Date; end_date: Date }) => {
        try {
            const postStats = await Post.unscoped().findOne({
                attributes: [
                    [fn('COUNT', col('id')), 'total_posts'],
                    [fn('COUNT', literal(`CASE WHEN approval_status = 'approved' THEN 1 END`)), 'approved_posts'],
                    [fn('COUNT', literal(`CASE WHEN approval_status = 'pending' THEN 1 END`)), 'pending_posts'],
                ],
                where: {
                    created_at: {
                        [Op.gte]: start_date,
                        [Op.lt]: end_date,
                    },
                },
                raw: true,
            })

            const totalUsers = await User.count({
                where: {
                    created_at: {
                        [Op.gte]: start_date,
                        [Op.lt]: end_date,
                    },
                },
            })

            return {
                ...postStats,
                total_users: totalUsers,
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new AnalyticService()
