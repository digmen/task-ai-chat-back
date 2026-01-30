import db from "./sqlite.js";

const createChatStmt = db.prepare('INSERT INTO chats (user_id, title) VALUES (?, ?)');
const getUserChatsStmt = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC');
const getChatByIdStmt = db.prepare('SELECT * FROM chats WHERE id = ?');
const addMessageStmt = db.prepare('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)');
const getChatMessagesStmt = db.prepare('SELECT role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC');

export function createChat(userId: number, title: string = 'New Chat'): number {
    const result = createChatStmt.run(userId, title);
    return Number(result.lastInsertRowid);
}

export function getUserChats(userId: number) {
    return getUserChatsStmt.all(userId);
}

export function getChatById(chatId: number) {
    return getChatByIdStmt.get(chatId);
}

export function addMessage(chatId: number, role: 'user' | 'assistant', content: string) {
    const result = addMessageStmt.run(chatId, role, content);
    return {
        id: Number(result.lastInsertRowid),
        role,
        content,
        created_at: new Date().toISOString()
    };
}

export function getChatMessages(chatId: number) {
    return getChatMessagesStmt.all(chatId);
}