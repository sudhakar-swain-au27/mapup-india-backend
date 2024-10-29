import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import bodyParser from 'body-parser';
import { limiter } from './middleware/rateLimitMiddleware.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

export default app;
