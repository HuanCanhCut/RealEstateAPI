import bcrypt from 'bcrypt'
import admin from 'firebase-admin'
import jwt, { JwtPayload } from 'jsonwebtoken'
import moment from 'moment-timezone'
import { QueryTypes } from 'sequelize'
import { v4 as uuidv4 } from 'uuid'

import {
    AppError,
    ConflictError,
    InternalServerError,
    UnauthorizedError,
    UnprocessableEntityError,
} from '../errors/errors'
import { RefreshToken, User } from '../models'
import { addMailJob } from '../queue/mail'
import createToken from '../utils/createToken'
import hashValue from '../utils/hashValue'
import { sequelize } from '~/config/database'
import { redisClient } from '~/config/redis'
import { RedisKey } from '~/enum/redis'

class AuthServices {
    generateToken(payload: { sub: number }) {
        try {
            const token = createToken({ payload }).token
            const refreshToken = createToken({ payload }).refreshToken

            return { token, refreshToken }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    private createAuthChallengeId = async ({ payload }: { payload: { email: string } }) => {
        try {
            const hasAuthChallengeId = await redisClient.get(`${RedisKey.AUTH_CHALLENGE_ID}${payload.email}`)

            if (hasAuthChallengeId) {
                await redisClient.del(`${RedisKey.AUTH_CHALLENGE_ID}${payload.email}`)
            }

            const auth_challenge_id = uuidv4()

            await redisClient.set(
                `${RedisKey.AUTH_CHALLENGE_ID}${payload.email}`,
                JSON.stringify({
                    auth_challenge_id,
                    created_at: moment.tz(new Date(), 'Asia/Ho_Chi_Minh').format(),
                }),
                {
                    EX: Number(process.env.VERIFY_AUTH_TTL),
                },
            )

            return auth_challenge_id
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    register = async ({ email, password }: { email: string; password: string }) => {
        try {
            const passwordHashed = await hashValue(password)

            const emailName = email.split('@')[0]

            const lastNickname = await this.getLastNickname(emailName)

            const nickname = lastNickname !== null ? `${emailName}${Number(lastNickname) + 1}` : emailName

            const [user, created]: [User, boolean] = await User.unscoped().findOrCreate<any>({
                where: {
                    email,
                },
                defaults: {
                    email,
                    uuid: uuidv4(),
                    password: passwordHashed,
                    first_name: '',
                    last_name: emailName,
                    avatar: '',
                    is_active: false,
                    nickname,
                },
            })

            if (!created) {
                const isPasswordValid = bcrypt.compareSync(password, user.get('password')!)

                if (!user.is_active && isPasswordValid) {
                    // send email to user to activate account
                    await this.sendVerifyCode({ email, type: 'activate_account' })
                } else {
                    throw new ConflictError({ message: 'Tài khoản đã tồn tại' })
                }
            }

            await this.sendVerifyCode({ email, type: 'activate_account' })

            const auth_challenge_id = await this.createAuthChallengeId({ payload: { email: user.get('email')! } })

            delete user.dataValues.password
            delete user.dataValues.email

            return { user, auth_challenge_id }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    login = async ({ email, password }: { email: string; password: string }) => {
        try {
            const user = await User.unscoped().findOne({
                where: {
                    email,
                },
            })

            if (!user) {
                throw new UnauthorizedError({ message: 'Email hoặc mật khẩu không chính xác' })
            }

            const isPasswordValid = bcrypt.compareSync(password, user.get('password')!)

            if (!isPasswordValid) {
                throw new UnauthorizedError({ message: 'Email hoặc mật khẩu không chính xác' })
            }

            const payload = {
                sub: user.dataValues.id as number,
            }

            const { token, refreshToken } = this.generateToken(payload)

            if (!user.is_active) {
                const auth_challenge_id = await this.createAuthChallengeId({ payload: { email: user.get('email')! } })

                await this.sendVerifyCode({ email: user.get('email')!, type: 'activate_account' })

                return { user, auth_challenge_id, token, refreshToken }
            }

            delete user.dataValues.password
            delete user.dataValues.email

            return { token, refreshToken, user }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    logout = async ({ access_token, refresh_token }: { access_token: string; refresh_token: string }) => {
        try {
            if (access_token) {
                // save token to blacklist and delete refreshToken in database
                await Promise.all([
                    redisClient.set(`blacklist-${access_token}`, 'true', { EX: Number(process.env.EXPIRED_TOKEN) }),
                    RefreshToken.destroy({ where: { refresh_token } }),
                ])
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    private getLastNickname = async (nickname: string) => {
        const [rows] = await sequelize.query(
            `
                SELECT 
                    COALESCE(
                        MAX(
                            CAST(
                                SUBSTRING(nickname, LENGTH(:nickname) + 1) 
                                AS UNSIGNED
                            )
                        ), 
                        NULL
                    ) as max_num
                FROM users 
                WHERE nickname REGEXP CONCAT('^', :nickname, '[0-9]+$')  
                OR nickname = :nickname;
            `,
            {
                replacements: {
                    nickname: nickname,
                },
                type: QueryTypes.RAW,
            },
        )

        return (rows[0] as { max_num: number | null })?.max_num
    }

    loginWithToken = async ({ token }: { token: string }) => {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token)

            const { email, name, picture } = decodedToken

            if (!email || !name || !picture) {
                throw new UnauthorizedError({ message: 'Token không hợp lệ' })
            }

            const splitName = name.split(' ')

            const firstName = splitName.length === 1 ? '' : splitName.slice(0, splitName.length - 1).join(' ')
            const lastName = splitName.slice(splitName.length - 1).join(' ')

            const emailPrefix = email.split('@')[0]

            let hasUser = await User.scope('withEmail').findOne({
                where: {
                    email,
                },
            })

            if (!hasUser) {
                const lastNickname = await this.getLastNickname(emailPrefix)

                const nickname = lastNickname !== null ? `${emailPrefix}${Number(lastNickname) + 1}` : emailPrefix

                hasUser = await User.create({
                    email,
                    first_name: firstName,
                    last_name: lastName,
                    full_name: name,
                    nickname,
                    uuid: uuidv4(),
                    avatar: picture,
                    role: 'student',
                    is_active: true,
                    is_blocked: false,
                })
            }

            const { token: accessToken, refreshToken } = this.generateToken({
                sub: hasUser.id as number,
            })

            if (!hasUser.is_active) {
                const auth_challenge_id = await this.createAuthChallengeId({
                    payload: { email: hasUser.get('email')! },
                })

                await this.sendVerifyCode({ email: hasUser.get('email')!, type: 'activate_account' })

                delete hasUser.email

                return { user: hasUser, auth_challenge_id, token: accessToken, refreshToken }
            }

            delete hasUser.email

            return { token: accessToken, refreshToken, user: hasUser }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    refreshToken = async ({ refresh_token }: { refresh_token: string }) => {
        try {
            let decoded: JwtPayload | null = null

            try {
                decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload
            } catch (error: any) {
                if (error.message === 'jwt expired') {
                    await RefreshToken.destroy({ where: { refresh_token } })

                    throw new UnauthorizedError({ message: 'Refresh token đã hết hạn' })
                }

                throw new UnprocessableEntityError({ message: error.message })
            }

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Token không hợp lệ hoặc đã hết hạn' })
            }

            const hasRefreshToken = await RefreshToken.findOne({
                where: { refresh_token },
            })

            // if have'nt refreshToken in database
            if (!hasRefreshToken) {
                throw new UnauthorizedError({ message: 'Token không hợp lệ hoặc đã hết hạn' })
            }

            const payload = { sub: Number(decoded.sub) }

            if (!decoded.exp) {
                throw new UnauthorizedError({ message: 'Token không hợp lệ hoặc đã hết hạn' })
            }

            // Giữ giá trị exp token cũ gắn vào token mới
            const exp = Math.floor((decoded.exp * 1000 - Date.now()) / 1000)

            const newAccessToken = createToken({ payload }).token
            const newRefreshToken = createToken({ payload, expRefresh: exp }).refreshToken

            await RefreshToken.update(
                {
                    refresh_token: newRefreshToken,
                },
                {
                    where: {
                        refresh_token,
                    },
                },
            )

            return { newAccessToken, newRefreshToken }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    sendVerifyCode = async ({ email, type }: { email: string; type: 'activate_account' | 'reset_password' }) => {
        try {
            // 6 number
            const resetCode = Math.floor(100000 + Math.random() * 900000)

            const hasCode = await redisClient.get(`${type}_${email}`)

            if (hasCode) {
                await redisClient.del(`${type}_${email}`)
            }

            const codeTtl = Number(process.env.VERIFY_AUTH_TTL)

            await Promise.all([
                redisClient.set(`${type}_${email}`, resetCode, { EX: codeTtl }),
                addMailJob({ email, code: Number(resetCode), type }),
            ])
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    private verifyCode = async ({
        email,
        type,
        code,
    }: {
        email: string
        type: 'activate_account' | 'reset_password'
        code: string
    }) => {
        try {
            const hasCode: string | null = await redisClient.get(`${type}_${email}`)

            if (!hasCode || hasCode !== code) {
                throw new UnauthorizedError({ message: 'Mã xác minh không hợp lệ hoặc đã hết hạn' })
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    resetPassword = async ({ email, code, password }: { email: string; code: string; password: string }) => {
        try {
            await this.verifyCode({ email, type: 'reset_password', code })

            // Update password
            const passwordHashed = await hashValue(password)

            await User.update({ password: passwordHashed }, { where: { email } })

            await redisClient.del(`${RedisKey.RESET_PASSWORD}${email}`)
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    verifyAccount = async ({ email, code }: { email: string; code: string }) => {
        try {
            await this.verifyCode({ email, type: 'activate_account', code })

            const user = await User.findOne({ where: { email } })

            if (!user) {
                throw new UnauthorizedError({ message: 'Email hoặc mã xác minh không hợp lệ' })
            }

            if (user.is_active) {
                throw new UnauthorizedError({ message: 'Tài khoản đã được xác thực' })
            }

            if (user) {
                user.set('is_active', true)
                await user.save()
            }

            await redisClient.del(`${RedisKey.ACTIVATE_ACCOUNT}${email}`)
            await redisClient.del(`${RedisKey.AUTH_CHALLENGE_ID}${email}`)

            const { token, refreshToken } = this.generateToken({ sub: user.id as number })

            return { token, refreshToken }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }

    verifyAuthChallengeId = async ({ auth_challenge_id, email }: { auth_challenge_id: string; email: string }) => {
        try {
            const payload = await redisClient.get(`${RedisKey.AUTH_CHALLENGE_ID}${email}`)

            if (!payload) {
                throw new UnauthorizedError({ message: 'Auth challenge ID không hợp lệ hoặc đã hết hạn' })
            }

            const payloadData = JSON.parse(payload)

            if (payloadData.auth_challenge_id !== auth_challenge_id) {
                throw new UnauthorizedError({ message: 'Auth challenge ID không hợp lệ hoặc đã hết hạn' })
            }

            return payloadData
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message })
        }
    }
}

export default new AuthServices()
