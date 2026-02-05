import { NextFunction, Response } from 'express'

import { responsePagination } from '../response/responsePagination'
import UserService from '../services/UserService'
import { PaginationRequest } from '../validators/api/commonSchema'
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

    getUsers = async (req: PaginationRequest, res: Response, next: NextFunction) => {
        try {
            const { page, per_page } = req.query

            const { users, total } = await UserService.getUsers(Number(page), Number(per_page))

            res.json(
                responsePagination({
                    req,
                    data: users,
                    total: total,
                    count: users.length,
                    current_page: Number(page),
                    per_page: Number(per_page),
                }),
            )
        } catch (error) {
            return next(error)
        }
    }
}

export default new UserController()
