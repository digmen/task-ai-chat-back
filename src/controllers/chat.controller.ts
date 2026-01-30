import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import * as ChatRepo from '../db/chat.repository.js';
import * as AIService from '../services/ai.service.js';
import { AppError } from '../utils/AppError.js';
import { Chat } from '../interfaces/index.js';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { message } = req.body;
    let chatId = req.body.chatId ? parseInt(req.body.chatId) : null;

    if (!message) throw new AppError('Message is required', 400);

    if (!chatId) {
        const title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
        chatId = ChatRepo.createChat(userId, title);
    } else {
        const chat = ChatRepo.getChatById(chatId) as Chat | undefined;
        if (!chat || chat.user_id !== userId) throw new AppError('Access denied', 403);
    }

    ChatRepo.addMessage(chatId, 'user', message);
    
    const history = ChatRepo.getChatMessages(chatId).slice(-10) as { role: string; content: string; }[];
    const aiResponseText = await AIService.getAIResponse(history, message);
    const savedAiMessage = ChatRepo.addMessage(chatId, 'assistant', aiResponseText);

    res.json({
        chatId,
        userMessage: { role: 'user', content: message },
        aiMessage: savedAiMessage
    });
});

export const getChats = asyncHandler(async (req: Request, res: Response) => {
    const chats = ChatRepo.getUserChats(req.userId!);
    res.json(chats);
});

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const chatId = parseInt(req.params.id as string);
    
    if (isNaN(chatId)) throw new AppError('Invalid chat ID', 400);

    const chat = ChatRepo.getChatById(chatId) as Chat | undefined;
    
    if (!chat || chat.user_id !== req.userId!) {
        throw new AppError('Access denied', 403);
    }

    const messages = ChatRepo.getChatMessages(chatId);
    res.json(messages);
});