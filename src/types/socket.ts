import { Comment } from '~/app/models'

interface SocketMeta {
    success: boolean
    error: string | null
}

interface ServerToClientEvents {
    JOIN_POST_COMMENTS: ({ data, meta }: { data: { post_id: number }; meta: SocketMeta }) => void
    LEAVE_POST_COMMENTS: ({ data, meta }: { data: { post_id: number }; meta: SocketMeta }) => void
    NEW_COMMENT: ({ data, meta }: { data: Comment | null; meta: SocketMeta }) => void
    COMMENT_REPLY_META: ({ data, meta }: { data: { comment_id: number; delta: number }; meta: SocketMeta }) => void
    DELETED_COMMENT: ({ data, meta }: { data: { comment_id: number }; meta: SocketMeta }) => void
}

interface ClientToServerEvents {
    JOIN_POST_COMMENTS: ({ post_id }: { post_id: number }) => void
    LEAVE_POST_COMMENTS: ({ post_id }: { post_id: number }) => void
    NEW_COMMENT: ({ content, post_id, parent_id }: { content: string; post_id: number; parent_id?: number }) => void
    DELETE_COMMENT: ({ comment_id }: { comment_id: number }) => void
}

interface InterServerEvents {
    ping: () => void
}

export type { ClientToServerEvents, InterServerEvents, ServerToClientEvents }
