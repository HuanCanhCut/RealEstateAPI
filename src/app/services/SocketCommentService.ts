import { Socket } from 'socket.io'

import { Comment } from '../models'
import CommentService from './CommentService'
import { ioInstance } from '~/config/socket'
import logger from '~/logger/logger'
import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '~/types/socket'

class SocketCommentService {
    private socket
    private currentUserId?: number

    constructor(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>, currentUserId?: number) {
        this.socket = socket
        this.currentUserId = currentUserId || socket.data.decoded?.sub
    }

    JOIN_POST_COMMENTS = async ({ post_id }: { post_id: number }) => {
        try {
            // Join comments channel
            this.socket?.join(`comment:post:${post_id}`)
        } catch (error) {
            logger.error('JOIN_POST_COMMENTS', error)
        }
    }

    LEAVE_POST_COMMENTS = async ({ post_id }: { post_id: number }) => {
        try {
            // Leave comments channel
            this.socket?.leave(`comment:post:${post_id}`)
        } catch (error) {
            logger.error('LEAVE_POST_COMMENTS', error)
        }
    }

    NEW_COMMENT = async ({ content, post_id, parent_id }: { content: string; post_id: number; parent_id?: number }) => {
        try {
            const comment = await Comment.create({
                content,
                post_id,
                user_id: this.currentUserId!,
                parent_id: parent_id || null,
            })

            const newComment = await CommentService.getCommentById(comment.id!)

            if (newComment) {
                ioInstance.to(`comment:post:${post_id}`).emit('NEW_COMMENT', {
                    data: newComment,
                    meta: { success: true, error: null },
                })

                if (newComment.parent_id) {
                    const parent = await CommentService.getCommentById(newComment.parent_id)

                    if (parent) {
                        this.socket.broadcast.to(`comment:post:${post_id}`).emit('COMMENT_REPLY_META', {
                            data: { comment_id: parent.id!, delta: 1 },
                            meta: { success: true, error: null },
                        })
                    }
                }

                return
            }

            this.socket?.emit('NEW_COMMENT', {
                data: null,
                meta: { success: false, error: 'Failed to create comment' },
            })
        } catch (error) {
            this.socket?.emit('NEW_COMMENT', {
                data: null,
                meta: {
                    success: false,
                    error: error instanceof Error ? error.message : 'An unknown error occurred',
                },
            })

            logger.error('NEW_COMMENT', error)
        }
    }

    // DELETE_COMMENT = async ({ comment_id }: { comment_id: number }) => {
    //     try {
    //         const comment = await Comment.findByPk(comment_id)

    //         if (!comment) {
    //             this.socket?.emit('DELETED_COMMENT', {
    //                 data: { comment_id },
    //                 meta: { success: false, error: 'Không tìm thấy comment này' },
    //             })

    //             return
    //         }

    //         if (comment.user_id !== this.currentUserId) {
    //             this.socket?.emit('DELETED_COMMENT', {
    //                 data: { comment_id },
    //                 meta: { success: false, error: 'Bạn không có quyền xóa comment này' },
    //             })
    //         }

    //         await Comment.destroy({ where: { id: comment_id } })

    //         if (comment.commentable_type === 'Comment') {
    //             const parent = await CommentService.getCommentById(comment.commentable_id!)
    //             if (parent) {
    //                 ioInstance
    //                     .to(`comment:${parent.commentable_type}:${parent.commentable_id}`)
    //                     .emit('COMMENT_REPLY_META', {
    //                         data: { comment_id: parent.id!, delta: -1 },
    //                         meta: { success: true, error: null },
    //                     })
    //             }
    //         }

    //         ioInstance.to(`comment:${comment.commentable_type}:${comment.commentable_id}`).emit('DELETED_COMMENT', {
    //             data: { comment_id },
    //             meta: { success: true, error: null },
    //         })
    //     } catch (error) {
    //         logger.error('DELETE_COMMENT', error)
    //     }
    // }
}

export default SocketCommentService
