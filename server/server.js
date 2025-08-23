import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import { PORT } from './config/env.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';

const app = express();
app.use(cors({
    origin: '*', // or '*' for all origins (not recommended in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send("Welcome to Artzen");
});
app.listen(PORT, async () => {
    await connectDB();
    console.log("Server is running on PORT", PORT);
})