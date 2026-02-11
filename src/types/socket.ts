import { Comment } from '~/app/models'

export const CommentableType = ['Textbook', 'ReferenceMaterial', 'Assignment', 'Comment'] as const
export type CommentableType = (typeof CommentableType)[number]

interface SocketMeta {
    success: boolean
    error: string | null
}

interface ServerToClientEvents {
    UPDATE_LAST_MESSAGE: ({ data, meta }: { data: { comment_id: number; delta: number }; meta: SocketMeta }) => void
}

interface ClientToServerEvents {
    NEW_MESSAGE: ({
        content,
        parent_id,
        type,
        topic_uuid,
    }: {
        content: string
        parent_id?: number | null
        type: 'text' | 'image'
        topic_uuid: string
    }) => void
}

interface InterServerEvents {
    ping: () => void
}

export type { ClientToServerEvents, InterServerEvents, ServerToClientEvents }
