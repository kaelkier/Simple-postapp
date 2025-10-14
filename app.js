import { userRouter } from './routes/userRoute.js';
import { postRouter } from './routes/postRoute.js';
import { connectDB } from './db/dbConnect.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const app = express();
dotenv.config();

const start = async () => {
    try {
        await connectDB();

        app.use(express.json());
        app.use(cors());

        app.use('/api/user', userRouter);
        app.use('/api/post', postRouter);

        app.listen(process.env.PORT);
        console.log(`App listen on port ${process.env.PORT}`);
    } catch (error) {
        console.error('Server failed to start', error);
        process.exit(1);
    }
};

start();