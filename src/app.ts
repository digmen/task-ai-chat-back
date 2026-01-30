import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate.js';
import authRoutes from './routes/auth.routes.js'; 
import chatRoutes from './routes/chat.routes.js'; 
import { globalErrorHandler } from './middlewares/error.middleware.js';

const app = express();

runMigrations();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.use(globalErrorHandler);

export default app;