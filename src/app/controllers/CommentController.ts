import { NextFunction, Response } from 'express'

import CommentService from '../services/CommentService'
import { GetCommentsRequest } from '../validators/api/commentSchema'

class CommentController {
    getComments = async (req: GetCommentsRequest, res: Response, next: NextFunction) => {
        try {
            const { limit, offset, parent_id, post_id } = req.query

            const { comments, total, totalComments } = await CommentService.getComments({
                limit: Number(limit),
                offset: Number(offset),
                parent_id: parent_id ? Number(parent_id) : null,
                post_id: Number(post_id),
            })

            res.json({
                data: comments,
                meta: {
                    pagination: {
                        total,
                        count: comments.length,
                        limit: Number(limit),
                        offset: Number(offset),
                    },
                    total_comments: totalComments,
                },
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new CommentController()
