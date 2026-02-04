import { NextFunction, Response } from 'express'

import PostService from '../services/PostService'
import { CreatePostRequest } from '../validators/api/posts'

class PostController {
    createPost = async (req: CreatePostRequest, res: Response, next: NextFunction) => {
        try {
            const {
                title,
                description,
                administrative_address,
                sub_locality,
                type,
                images,
                category_id,
                role,
                post_detail,
            } = req.body

            const decoded = req.decoded

            const post = await PostService.createPost({
                title,
                description,
                administrative_address,
                sub_locality,
                type,
                images,
                category_id,
                role,
                post_detail,
                userId: decoded?.sub,
            })

            res.json({
                data: post,
            })
        } catch (error) {
            return next(error)
        }
    }
}

export default new PostController()
