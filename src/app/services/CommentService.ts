import { Op } from 'sequelize'

import { AppError, InternalServerError } from '../errors/errors'
import { User } from '../models'
import Comment from '../models/Comment'
import { sequelize } from '~/config/database'

class CommentService {
    getComments = async ({
        post_id,
        limit,
        offset,
        parent_id,
    }: {
        post_id: number
        limit: number
        offset: number
        parent_id?: number | null
    }) => {
        try {
            const [{ rows: comments, count: total }, totalComments] = await Promise.all([
                Comment.findAndCountAll({
                    distinct: true,
                    include: [
                        {
                            model: User,
                            as: 'user',
                        },
                    ],
                    attributes: {
                        include: [
                            [
                                sequelize.literal(`(
                                SELECT COUNT(1)
                                FROM comments
                                WHERE comments.parent_id = Comment.id
                            )`),
                                'reply_count',
                            ],
                        ],
                    },
                    where: {
                        post_id,
                        parent_id: parent_id ? parent_id : { [Op.is]: null },
                    },
                    limit,
                    offset,
                    order: [['id', 'DESC']],
                }),
                Comment.count({
                    where: {
                        post_id,
                    },
                }),
            ])

            return {
                comments,
                total,
                totalComments,
            }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    getCommentById = async (id: number) => {
        try {
            const comment = await Comment.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                    },
                ],
                attributes: {
                    include: [
                        [
                            sequelize.literal(`(SELECT COUNT(1) FROM comments WHERE comments.parent_id = Comment.id)`),
                            'reply_count',
                        ],
                    ],
                },
            })

            return comment
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new CommentService()
