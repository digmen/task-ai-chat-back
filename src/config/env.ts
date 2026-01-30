import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key-change-it',
    AI_API_KEY: process.env.AI_API_KEY,
    DB_PATH: process.env.NODE_ENV === 'production' 
        ? path.resolve('data/db.sqlite') 
        : path.resolve('db.sqlite'),
    SYSTEM_PROMPT: `
Ты — ведущий технический специалист веб-студии Mantis Studio. 
Твое имя — Макс. Ты общаешься вежливо, профессионально, но кратко. 
Если тебя спросят, кто ты, отвечай: "Я инженер из Mantis Studio, помогаю с техническими вопросами".
    `.trim()
};