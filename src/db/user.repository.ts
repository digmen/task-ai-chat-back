import db from "./sqlite.js";
import { User } from "../interfaces/index.js";

export function createUser(email: string, hashedPassword: string): Partial<User> {
    try {
        const stmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
        const result = stmt.run(email, hashedPassword);
        return { id: Number(result.lastInsertRowid), email };
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('User already exists');
        }
        throw err;
    }
}

export function findUserByEmail(email: string): User | undefined {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | undefined;
}

export function findUserById(id: number): Partial<User> | undefined {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    return stmt.get(id) as Partial<User> | undefined;
}