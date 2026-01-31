import OpenAI from 'openai';
import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.AI_API_KEY, 
  defaultHeaders: {
    "HTTP-Referer": "https://mantis.stud", 
    "X-Title": "Mantis AI",
  }
});

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
            model: "meta-llama/llama-3.3-70b-instruct", 
            temperature: 0.7,
            max_tokens: 4096,
        });

        return response.choices[0]?.message?.content || "No response generated.";
    } catch (error: any) {
        console.error("OPENROUTER API ERROR:", error); 
        throw new AppError("AI Service Unavailable", 503);
    }
};