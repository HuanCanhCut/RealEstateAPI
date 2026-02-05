import { pickBy } from 'lodash'

import { AppError, InternalServerError, NotFoundError } from '../errors/errors'
import { Post, User } from '../models'
import { sequelize } from '~/config/database'

class UserService {
    getUserByNickname = async (nickname: string) => {
        try {
            const user = await User.findOne({ where: { nickname } })

            if (!user) {
                throw new NotFoundError({ message: 'User not found' })
            }

            return user
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    updateCurrentUser = async ({
        userId,
        first_name,
        last_name,
        avatar,
        address,
        phone_number,
    }: {
        userId: number
        first_name: string
        last_name: string
        avatar?: string
        address?: string
        phone_number?: string
    }) => {
        try {
            const user = await User.findByPk(userId)

            if (!user) {
                throw new NotFoundError({ message: 'User not found' })
            }

            await user.update(
                pickBy(
                    {
                        first_name,
                        last_name,
                        avatar,
                        address,
                        phone_number,
                    },
                    (value) => value !== undefined,
                ),
            )

            return await User.findByPk(userId)
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    getUsers = async (page: number, per_page: number) => {
        try {
            const { rows: users, count: total } = await User.findAndCountAll({
                distinct: true,
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(
                                SELECT COUNT(1)
                                FROM posts 
                                WHERE posts.user_id = User.id
                            )`),
                            'post_count',
                        ],
                    ],
                },
                limit: per_page,
                offset: (page - 1) * per_page,
            })

            return {
                users,
                total,
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new UserService()
