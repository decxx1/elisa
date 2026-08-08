import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const databasePath = process.env.DATABASE_PATH ?? './data/app.db';
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);

try {
	db.pragma('busy_timeout = 5000');
	db.exec(`
		CREATE TABLE IF NOT EXISTS guests (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			dni TEXT NOT NULL UNIQUE,
			attending INTEGER NOT NULL DEFAULT 1,
			message TEXT,
			created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
		);

		DELETE FROM guests;
		DELETE FROM sqlite_sequence WHERE name = 'guests';
	`);
	db.pragma('wal_checkpoint(TRUNCATE)');
	console.log(`Base de datos reiniciada: ${databasePath}`);
} finally {
	db.close();
}
