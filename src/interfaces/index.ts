export interface User {
    id: number;
    email: string;
    password?: string; 
    created_at: string;
}

export interface JwtPayload {
    id: number;
    email: string;
}

export interface Chat {
    id: number;
    user_id: number;
    title: string;
    created_at: string;
}

export interface Message {
    id: number;
    chat_id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}