import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoutes from './routes/AuthRoutes.js';
import SwapRequestRouter from './routes/SwapRequestRoutes..js';
import MessageRoutes from './routes/MessageRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import ConnectRoutes from './routes/ConnectRoutes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/api/users', UserRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/swaps', SwapRequestRouter);
app.use('/api/messages', MessageRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/connect', ConnectRoutes);

app.get('/', (req, res) => {
    res.send('LearnLoop is running');
});

export default app;
