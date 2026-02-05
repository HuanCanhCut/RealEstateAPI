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
}

export default new UserService()
