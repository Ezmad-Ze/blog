import express, { Application } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import blogRouter from './routes/blog.route';
import commentRouter from './routes/comment.route';


const prisma = new PrismaClient();

export const createApp = (): Application => {
    const app = express();

    app.use(cors());
    app.use(express.json());


    app.use('/auth', authRouter);
    app.use('/users', userRouter);
    app.use('/blogs', blogRouter);
    app.use('/comments', commentRouter);

    app.get('/', (req, res) => {
        res.send('Welcome to the Blog Platform API!');
    });

    return app;
};
