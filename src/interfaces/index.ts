// Тип пользователя из базы данных
export interface User {
    id: number;
    email: string;
    password?: string; // Пароль опционален, так как мы удаляем его перед отправкой на клиент
    created_at: string;
}

// Тип полезной нагрузки JWT токена
export interface JwtPayload {
    id: number;
    email: string;
}

// Тип чата
export interface Chat {
    id: number;
    user_id: number;
    title: string;
    created_at: string;
}

// Тип сообщения
export interface Message {
    id: number;
    chat_id: number;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}