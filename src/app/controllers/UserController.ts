import { NextFunction, Response } from 'express'

import UserService from '../services/UserService'
import { GetUserByNicknameRequest } from '../validators/api/userSchema'

class UserController {
    getUserByNickname = async (req: GetUserByNicknameRequest, res: Response, next: NextFunction) => {
        try {
            const { nickname } = req.params

            const user = await UserService.getUserByNickname(nickname)

            res.json({
                data: user,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new UserController()
