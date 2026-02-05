import { pickBy } from 'lodash'

import { AppError, InternalServerError, NotFoundError } from '../errors/errors'
import { User } from '../models'

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
}

export default new UserService()
