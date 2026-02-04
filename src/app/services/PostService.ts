import { PostDetail } from '../models'
import Post from '../models/PostModel'

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
}

export default new PostService()
