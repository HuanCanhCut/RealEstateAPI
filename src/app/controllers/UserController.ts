import { NextFunction, Response } from 'express'

import UserService from '../services/UserService'
import { GetUserByNicknameRequest, UpdateCurrentUserRequest } from '../validators/api/userSchema'

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

    updateCurrentUser = async (req: UpdateCurrentUserRequest, res: Response, next: NextFunction) => {
        try {
            const decoded = req.decoded

            const { first_name, last_name, avatar, address, phone_number } = req.body

            const user = await UserService.updateCurrentUser({
                userId: decoded.sub,
                first_name,
                last_name,
                avatar,
                address,
                phone_number,
            })

            res.json({
                data: user,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new UserController()
