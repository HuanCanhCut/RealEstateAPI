import { Op } from 'sequelize'

import { AppError, BadRequestError, ForBiddenError, InternalServerError, NotFoundError } from '../errors/errors'
import { Category, Favorite, PostDetail, User } from '../models'
import Post from '../models/PostModel'
import { sequelize } from '~/config/database'

interface PostDetailInterface {
    bedrooms: number
    bathrooms: number
    balcony: string
    main_door: string
    legal_documents: string
    interior_status: string
    area: number
    price: number
    deposit: number
}

interface CreatePostParams {
    title: string
    description: string
    administrative_address: string
    sub_locality: string
    type: 'sell' | 'rent'
    images: string[]
    category_id: number
    role: 'personal' | 'agent'
    post_detail: PostDetailInterface
    userId: number
}

class PostService {
    createPost = async ({
        title,
        description,
        administrative_address,
        sub_locality,
        type,
        images,
        category_id,
        role,
        post_detail,
        userId,
    }: CreatePostParams) => {
        const t = await sequelize.transaction()

        try {
            const hasCategory = await Category.findByPk(category_id)

            if (!hasCategory) {
                throw new NotFoundError({ message: 'Category not found' })
            }

            const post = await Post.create(
                {
                    title,
                    description,
                    administrative_address: administrative_address,
                    sub_locality: sub_locality,
                    type,
                    images: JSON.stringify(images),
                    approval_status: 'pending',
                    handover_status: 'not_delivered',
                    category_id: category_id,
                    role,
                    user_id: userId,
                },
                { transaction: t },
            )

            if (post) {
                await PostDetail.create(
                    {
                        post_id: post.id as number,
                        ...post_detail,
                    },
                    { transaction: t },
                )
            }

            await t.commit()

            const postData = await Post.unscoped().findByPk(post.id, {
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                    },
                ],
            })

            return postData
        } catch (error: any) {
            await t.rollback()

            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    getPosts = async ({
        page,
        per_page,
        role,
        category_id,
        location,
        userId,
        approval_status,
        min_price,
        max_price,
    }: {
        page: number
        per_page: number
        role?: 'personal' | 'agent'
        category_id?: number
        location?: string
        userId: number | null
        approval_status?: 'approved' | 'pending' | 'rejected' | 'all'
        min_price?: number
        max_price?: number
    }) => {
        try {
            const whereClause: any = {}

            if (role) {
                whereClause.role = role
            }

            if (category_id) {
                whereClause.category_id = category_id
            }

            if (location) {
                whereClause.administrative_address = {
                    [Op.like]: `%${location}%`,
                }
            }

            const currentUser = await User.findByPk(userId ?? 0)

            let PostScope = Post

            if (currentUser?.role === 'admin' && approval_status) {
                PostScope = Post.unscoped()

                if (approval_status !== 'all') {
                    whereClause.approval_status = approval_status
                }
            }

            const { rows: posts, count: total } = await PostScope.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                        where: {
                            price: {
                                [Op.gte]: min_price || 0,
                                [Op.lte]: max_price || 999999999999999,
                            },
                        },
                    },
                    {
                        model: Category,
                        as: 'category',
                    },
                    {
                        model: User,
                        as: 'user',
                    },
                ],
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                                CASE 
                                    WHEN EXISTS (
                                        SELECT 1
                                        FROM favorites
                                        WHERE favorites.user_id = ${sequelize.escape(userId || 0)}
                                          AND favorites.post_id = Post.id
                                    ) THEN TRUE
                                    ELSE FALSE
                                END
                            `),
                            'is_liked',
                        ],
                    ],
                },
                where: whereClause,
                limit: per_page,
                offset: (page - 1) * per_page,
                order: [['id', 'DESC']],
            })

            return { posts, total }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    updatePost = async ({
        title,
        description,
        administrative_address,
        sub_locality,
        type,
        images,
        category_id,
        role,
        post_detail,
        userId,
        postId,
    }: CreatePostParams & { postId: number }) => {
        try {
            // check if post exists
            const post = await Post.findByPk(postId)

            if (!post) {
                throw new NotFoundError({ message: 'Post not found' })
            }

            // check if user is the owner of the post
            if (post.user_id !== userId) {
                throw new ForBiddenError({ message: 'You are not the owner of this post' })
            }

            // update post
            await post.update({
                title,
                description,
                administrative_address,
                sub_locality,
                type,
                images: JSON.stringify(images),
                category_id,
                role,
                user_id: userId,
            })

            // update post detail
            await PostDetail.update(
                {
                    bedrooms: post_detail.bedrooms,
                    bathrooms: post_detail.bathrooms,
                    balcony: post_detail.balcony,
                    main_door: post_detail.main_door,
                    legal_documents: post_detail.legal_documents,
                    interior_status: post_detail.interior_status,
                    area: post_detail.area,
                    price: Number(post_detail.price),
                    deposit: Number(post_detail.deposit),
                },
                {
                    where: {
                        post_id: postId,
                    },
                },
            )

            const updatedPost = await Post.findByPk(postId, {
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                    },
                ],
            })

            return updatedPost
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    deletePost = async ({ postId, userId }: { postId: number; userId: number }) => {
        try {
            // check if post exists
            const [post, user] = await Promise.all([Post.findByPk(postId), User.findByPk(userId)])

            if (!post) {
                throw new NotFoundError({ message: 'Post not found' })
            }

            // check if user is the owner of the post
            if (post.user_id !== userId || user?.role !== 'admin') {
                throw new ForBiddenError({ message: 'You are not authorized to delete this post' })
            }

            // delete post
            await post.destroy()
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    getPostById = async ({ postId, userId }: { postId: number; userId: number | null }) => {
        try {
            const post = await Post.findByPk(postId, {
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: {
                            include: [
                                [
                                    sequelize.literal(`(
                                        SELECT COUNT(1)
                                        FROM posts
                                        WHERE posts.user_id = user.id
                                    )`),
                                    'post_count',
                                ],
                            ],
                        },
                    },
                    {
                        model: Category,
                        as: 'category',
                    },
                ],
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                                EXISTS (
                                    SELECT 1
                                    FROM favorites
                                    WHERE favorites.user_id = ${sequelize.escape(userId || 0)}
                                      AND favorites.post_id = Post.id
                                )
                            `),
                            'is_liked',
                        ],
                    ],
                },
            })

            if (!post) {
                throw new NotFoundError({ message: 'Post not found' })
            }

            return post
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    toggleLikePost = async ({ postId, userId, type }: { postId: number; userId: number; type: 'like' | 'unlike' }) => {
        try {
            // check if post exists
            const post = await Post.findByPk(postId)

            if (!post) {
                throw new NotFoundError({ message: 'Post not found' })
            }

            const favorite = await Favorite.findOne({
                where: {
                    post_id: postId,
                    user_id: userId,
                },
            })

            if (type === 'like') {
                if (favorite) {
                    throw new BadRequestError({ message: 'You have already liked this post' })
                }

                await Favorite.create({
                    post_id: postId,
                    user_id: userId,
                })
            } else {
                if (!favorite) {
                    throw new BadRequestError({ message: 'You have not liked this post' })
                }

                await Favorite.destroy({
                    where: {
                        post_id: postId,
                        user_id: userId,
                    },
                })
            }

            return true
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    searchPosts = async ({ keyword }: { keyword: string }) => {
        try {
            const posts = await Post.findAll({
                where: {
                    [Op.or]: [
                        {
                            title: {
                                [Op.like]: `${keyword}%`,
                            },
                        },
                        {
                            administrative_address: {
                                [Op.like]: `${keyword}%`,
                            },
                        },
                        {
                            sub_locality: {
                                [Op.like]: `${keyword}%`,
                            },
                        },
                    ],
                },
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                    },
                ],
                limit: 5,
                order: [['id', 'DESC']],
            })

            return posts
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    modifyPostApprovalStatus = async ({
        postId,
        userId,
        type,
    }: {
        postId: number
        userId: number
        type: 'approved' | 'rejected' | 'pending'
    }) => {
        try {
            const [post, user] = await Promise.all([Post.findByPk(postId), User.findByPk(userId)])

            if (!post) {
                throw new NotFoundError({ message: 'Post not found' })
            }

            if (user?.role !== 'admin') {
                throw new ForBiddenError({
                    message: 'You are not authorized to toggle the approval status of this post',
                })
            }

            if (post.approval_status === type) {
                throw new BadRequestError({ message: 'Post already has this approval status' })
            }

            await Post.update(
                {
                    approval_status: type,
                },
                {
                    where: {
                        id: postId,
                    },
                },
            )

            return post
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }

    getUserPosts = async ({ userId, page, per_page }: { userId: number; page: number; per_page: number }) => {
        try {
            const { rows: posts, count: total } = await Post.findAndCountAll({
                include: [
                    {
                        model: PostDetail,
                        as: 'detail',
                    },
                    {
                        model: Category,
                        as: 'category',
                    },
                    {
                        model: User,
                        as: 'user',
                    },
                ],
                where: {
                    user_id: userId,
                },
                limit: per_page,
                offset: (page - 1) * per_page,
                order: [['id', 'DESC']],
            })

            return { posts, total }
        } catch (error: any) {
            if (error instanceof AppError) {
                throw error
            }

            throw new InternalServerError({ message: error.message + ' ' + error.stack })
        }
    }
}

export default new PostService()
