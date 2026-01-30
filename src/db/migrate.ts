import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './sqlite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути к файлам
const SCHEMA_PATH = path.join(__dirname, 'schema.sql'); // <-- Твоя "Точка ноль"
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

export const runMigrations = () => {
    console.log('🔄 Проверка базы данных...');

    // 1. Создаем таблицу для отслеживания истории (если нет)
    db.exec(`
        CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Получаем список уже выполненных изменений
    const appliedMigrations = db.prepare('SELECT name FROM _migrations').all().map((row: any) => row.name);

    // --- ЭТАП 1: ТОЧКА НОЛЬ (SCHEMA.SQL) ---
    
    // Проверяем, был ли накатан базовый файл (назовем его условно 'INIT_SCHEMA')
    if (!appliedMigrations.includes('INIT_SCHEMA')) {
        if (fs.existsSync(SCHEMA_PATH)) {
            console.log('✨ База пустая. Накатываю "Точку ноль" (schema.sql)...');
            
            const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
            
            const transaction = db.transaction(() => {
                db.exec(schemaSql); // Выполняем SQL из файла
                // Отмечаем, что база инициализирована
                db.prepare("INSERT INTO _migrations (name) VALUES ('INIT_SCHEMA')").run();
            });

            try {
                transaction();
                console.log('✅ Базовая схема создана успешно.');
            } catch (error: any) {
                console.error('❌ Ошибка при создании базовой схемы:', error.message);
                process.exit(1);
            }
        } else {
            console.warn('⚠️ Файл schema.sql не найден! База может быть неполной.');
        }
    } else {
        // Если схема уже есть, просто идем дальше
        // console.log('Базовая схема уже установлена.');
    }

    // --- ЭТАП 2: АВТОМАТИЧЕСКИЕ МИГРАЦИИ ---

    if (!fs.existsSync(MIGRATIONS_DIR)) {
        fs.mkdirSync(MIGRATIONS_DIR);
    }

    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
        .filter(file => file.endsWith('.sql'))
        .sort();

    let migrationCount = 0;

    for (const file of migrationFiles) {
        if (!appliedMigrations.includes(file)) {
            const filePath = path.join(MIGRATIONS_DIR, file);
            const sql = fs.readFileSync(filePath, 'utf-8');

            console.log(`➡️ Применяю новую миграцию: ${file}`);

            const transaction = db.transaction(() => {
                db.exec(sql);
                db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
            });

            try {
                transaction();
                console.log(`✅ Успешно: ${file}`);
                migrationCount++;
            } catch (error: any) {
                console.error(`❌ Ошибка в миграции ${file}:`, error.message);
                process.exit(1);
            }
        }
    }

    if (migrationCount > 0) {
        console.log(`🚀 Применено миграций: ${migrationCount}`);
    } else {
        console.log('👌 Все миграции актуальны.');
    }
};