import db from "./sqlite.js";

export function createChat(userId: number, title: string = 'New Chat'): number {
    const stmt = db.prepare('INSERT INTO chats (user_id, title) VALUES (?, ?)');
    const result = stmt.run(userId, title);
    return Number(result.lastInsertRowid);
}

export function getUserChats(userId: number) {
    const stmt = db.prepare('SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
}

export function getChatById(chatId: number) {
    const stmt = db.prepare('SELECT * FROM chats WHERE id = ?');
    return stmt.get(chatId);
}

export function addMessage(chatId: number, role: 'user' | 'assistant', content: string) {
    const stmt = db.prepare('INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)');
    const result = stmt.run(chatId, role, content);
    return {
        id: Number(result.lastInsertRowid),
        role,
        content,
        created_at: new Date().toISOString()
    };
}

export function getChatMessages(chatId: number) {
    const stmt = db.prepare('SELECT role, content, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC');
    return stmt.all(chatId);
}