import db from "./sqlite.js";
import { User } from "../interfaces/index.js";

const insertUserStmt = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)');
const findUserByEmailStmt = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserByIdStmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');

export function createUser(email: string, hashedPassword: string): Partial<User> {
    try {
        const result = insertUserStmt.run(email, hashedPassword);
        return { id: Number(result.lastInsertRowid), email };
    } catch (err: any) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('User already exists');
        }
        throw err;
    }
}

export function findUserByEmail(email: string): User | undefined {
    return findUserByEmailStmt.get(email) as User | undefined;
}

export function findUserById(id: number): Partial<User> | undefined {
    return findUserByIdStmt.get(id) as Partial<User> | undefined;
}