import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import admin from 'firebase-admin'
import http from 'http'
import { Server } from 'socket.io'

import './config/env'
import setupGlobalErrorHandling from './app/errors/globalError'
setupGlobalErrorHandling()

import 'express-async-errors'
import './app/queue'
import * as database from './config/database/index'
import serviceAccount from './config/firebase/serviceAccount'
import { redisClient } from './config/redis'
import socketIO from './config/socket'
import route from './routes/index'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './types/socket'
const app = express()
const server = http.createServer(app)

const allowedOrigins: string[] = ['http://localhost:5173']

const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // allow requests from any origin
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Refresh-Token-Required', 'x-refresh-token-required'],
    credentials: true,
    maxAge: 86400,
}

app.use(cors(corsOptions))

const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true)
            if (allowedOrigins.includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error('CORS not allowed by server'))
            }
        },
        credentials: true,
    },
})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})

// connect to db
database.connect()

// connect to redis
;(async () => {
    await redisClient.connect()
})()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())
app.use(cookieParser())

// make express trust the proxy of the load balancer (nginx)
// so that we can get the correct protocol and host from the request
app.set('trust proxy', true)

route(app)
socketIO(io)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
