import { AppError, InternalServerError } from '../errors/errors'
import { User } from '../models'

class MeService {
    getUserById = async (user_id: number) => {
        try {
            const user = User.findByPk(user_id)

            return user
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new MeService()
