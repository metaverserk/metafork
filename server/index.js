import express from 'express';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import commentRoutes from './routes/comments.js';
import likeRoutes from './routes/likes.js';
import authRoutes from './routes/auth.js';
import dialogRoutes from './routes/dialogs.js';
import subscribeRoutes from './routes/subscribe.js';
import replyRoutes from './routes/reply.js';
import notifyRoutes from './routes/notify.js'
import uploadRoutes from './routes/upload.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";
import { handleConnection } from './socket/socketHandlers.js';
import winston from 'winston';
import dotenv from 'dotenv';
import './cron/cron.js';

dotenv.config();


const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'app.log' }),
    ],
});


const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.SITE_URL,
        credentials: true,
    },
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(
    cors({
        origin: process.env.SITE_URL,
        credentials: true,
    })
);



app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use(cookieParser());


app.use('/temp', express.static('temp'));
app.use("/api/1.0/users", userRoutes);
app.use("/api/1.0/posts", postRoutes);
app.use("/api/1.0/comments", commentRoutes);
app.use("/api/1.0/likes", likeRoutes);
app.use("/api/1.0/auth", authRoutes);
app.use("/api/1.0/dialogs", dialogRoutes);
app.use("/api/1.0/subscribe", subscribeRoutes);
app.use("/api/1.0/reply", replyRoutes);
app.use("/api/1.0/notify", notifyRoutes);
app.use("/api/1.0/upload", uploadRoutes);


io.on('connection', (socket) => {
    handleConnection(socket, io);
});


server.listen(8800, () => {
    console.log('Server start on port :8800');
})