import { Groq } from 'groq-sdk';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = new Groq({ apiKey: config.AI_API_KEY });

interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const getAIResponse = async (history: { role: string, content: string }[], userMessage: string): Promise<string> => {
    if (!config.AI_API_KEY) throw new AppError("AI Configuration Missing", 500);

    const messages: ChatMessage[] = [
        { role: "system", content: config.SYSTEM_PROMPT },
        ...history.map(msg => ({ 
            role: msg.role as 'user' | 'assistant', 
            content: msg.content 
        })),
        { role: "user", content: userMessage }
    ];

    try {
        const response = await client.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 4096,
        });

        return response.choices[0]?.message?.content || "No response generated.";
    } catch (error: any) {
        throw new AppError("AI Service Unavailable", 503);
    }
};