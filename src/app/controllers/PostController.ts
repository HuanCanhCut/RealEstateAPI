import { NextFunction, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

import { responsePagination } from '../response/responsePagination'
import PostService from '../services/PostService'
import { IdRequest, PaginationRequest } from '../validators/api/commonSchema'
import { CreatePostRequest, UpdatePostRequest } from '../validators/api/posts'

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

            res.status(201).json({
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

    updatePost = async (req: UpdatePostRequest, res: Response, next: NextFunction) => {
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

            const { postId } = req.params

            const decoded = req.decoded

            const post = await PostService.updatePost({
                postId: Number(postId),
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

    deletePost = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const { id: postId } = req.params

            const decoded = req.decoded

            await PostService.deletePost({
                postId: Number(postId),
                userId: decoded?.sub,
            })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }

    getPostById = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const { id: postId } = req.params

            const { access_token } = req.cookies

            let decoded: (JwtPayload & { sub: number }) | null = null

            if (access_token) {
                decoded = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload & { sub: number }
            }

            const post = await PostService.getPostById({ postId: Number(postId), userId: decoded?.sub ?? null })

            res.json({
                data: post,
            })
        } catch (error) {
            return next(error)
        }
    }

    likePost = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const { id: postId } = req.params

            const decoded = req.decoded

            await PostService.toggleLikePost({ postId: Number(postId), userId: decoded?.sub, type: 'like' })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }

    unlikePost = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const { id: postId } = req.params

            const decoded = req.decoded

            await PostService.toggleLikePost({ postId: Number(postId), userId: decoded?.sub, type: 'unlike' })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }
}

export default new PostController()
