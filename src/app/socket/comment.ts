import { Socket } from 'socket.io'

import SocketCommentService from '~/app/services/SocketCommentService'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '~/types/socket'

class commentListener {
    private socket

    constructor(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>) {
        this.socket = socket

        const socketCommentService = new SocketCommentService(socket)

        this.socket.on('JOIN_POST_COMMENTS', socketCommentService.JOIN_POST_COMMENTS)
        this.socket.on('LEAVE_POST_COMMENTS', socketCommentService.LEAVE_POST_COMMENTS)
        this.socket.on('NEW_COMMENT', socketCommentService.NEW_COMMENT)
        // this.socket.on('DELETE_COMMENT', socketCommentService.DELETE_COMMENT)
    }
}

export default commentListener
