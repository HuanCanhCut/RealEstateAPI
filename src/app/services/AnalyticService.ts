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

    getUsersMonthlyRegistrations = async () => {
        try {
            const now = new Date()

            const past90Days = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

            const rows = await User.findAll({
                attributes: [
                    [fn('YEAR', col('created_at')), 'year'],
                    [fn('MONTH', col('created_at')), 'month'],
                    [fn('COUNT', col('id')), 'count'],
                ],
                where: {
                    created_at: {
                        [Op.between]: [past90Days, now],
                    },
                },
                group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
                raw: true,
            })

            const months: { year: number; month: number; count: number }[] = []

            for (let i = 2; i >= 0; i--) {
                const day = new Date(now.getFullYear(), now.getMonth() - i, 1)
                months.push({
                    year: day.getFullYear(),
                    month: day.getMonth() + 1,
                    count: 0,
                })
            }

            rows.forEach((row: any) => {
                const found = months.find(
                    (month) => month.year === Number(row.year) && month.month === Number(row.month),
                )
                if (found) {
                    found.count = Number(row.count)
                }
            })

            return months
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new AnalyticService()
