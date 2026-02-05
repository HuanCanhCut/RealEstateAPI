import { AppError, InternalServerError } from '../errors/errors'
import { Category, PostDetail, User } from '../models'
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
}

interface CreatePostParams {
    title: string
    description: string
    administrative_address: string
    sub_locality: string
    type: 'sell' | 'rent'
    images: string[]
    category_id: number
    role: 'user' | 'agent'
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
        const post = await Post.create({
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
        })

        if (post) {
            await PostDetail.create({
                post_id: post.id as number,
                ...post_detail,
            })
        }

        const postData = Post.findByPk(post.id, {
            include: [
                {
                    model: PostDetail,
                    as: 'post_detail',
                },
            ],
        })

        return postData
    }

    getPosts = async (page: number, per_page: number, userId: number | null) => {
        try {
            const { rows: posts, count: total } = await Post.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: PostDetail,
                        as: 'post_detail',
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
                limit: per_page,
                offset: (page - 1) * per_page,
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
