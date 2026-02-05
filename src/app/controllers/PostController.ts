import { NextFunction, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { responsePagination } from '../response/responsePagination'
import PostService from '../services/PostService'
import { PaginationRequest } from '../validators/api/commonSchema'
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

    getPosts = async (req: PaginationRequest, res: Response, next: NextFunction) => {
        try {
            const { page, per_page } = req.query

            const { access_token } = req.cookies

            let decoded: (JwtPayload & { sub: number }) | null = null

            if (access_token) {
                decoded = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload & { sub: number }
            }

            const { posts, total } = await PostService.getPosts(Number(page), Number(per_page), decoded?.sub ?? null)

            res.json(
                responsePagination({
                    req,
                    data: posts,
                    total,
                    count: posts.length,
                    current_page: Number(page),
                    per_page: Number(per_page),
                }),
            )
        } catch (error) {
            return next(error)
        }
    }
}

export default new PostController()
