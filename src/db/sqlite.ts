import Database from 'better-sqlite3';
import { config } from '../config/env.js';

const db = new Database(config.DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;