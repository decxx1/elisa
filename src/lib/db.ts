import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const databasePath = process.env.DATABASE_PATH ?? './data/app.db';
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.exec(`
	CREATE TABLE IF NOT EXISTS guests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		dni TEXT NOT NULL UNIQUE,
		attending INTEGER NOT NULL DEFAULT 1,
		message TEXT,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`);

export type Guest = {
	id: number;
	name: string;
	dni: string;
	attending: boolean;
	message: string | null;
	createdAt: string;
};

export function registerGuest(input: { name: string; attending: boolean; message?: string }): Guest {
	const result = db.prepare(`
		INSERT INTO guests (name, dni, attending, message)
		VALUES (@name, @dni, @attending, @message)
	`).run({
		name: input.name,
		dni: randomUUID(),
		attending: input.attending ? 1 : 0,
		message: input.message || null
	});

	return getGuest(Number(result.lastInsertRowid)) as Guest;
}

function getGuest(id: number): Guest | undefined {
	const guest = db.prepare(`
		SELECT id, name, dni, attending = 1 AS attending, message, created_at AS createdAt
		FROM guests
		WHERE id = ?
	`).get(id) as Guest | undefined;

	return guest;
}

export function getGuestStats() {
	return db.prepare(`
		SELECT
			COUNT(*) AS total,
			COALESCE(SUM(attending), 0) AS confirmed
		FROM guests
	`).get() as { total: number; confirmed: number };
}

export type PublicGuest = {
	id: number;
	name: string;
	message: string | null;
	attending: boolean;
	createdAt: string;
};

export function listGuestbookGuests(): PublicGuest[] {
	const rows = db.prepare(`
		SELECT id, name, message, attending = 1 AS attending, created_at AS createdAt
		FROM guests
		WHERE attending = 1
			OR (message IS NOT NULL AND trim(message) != '')
		ORDER BY datetime(created_at) DESC, id DESC
	`).all() as Array<Omit<PublicGuest, 'attending'> & { attending: number | boolean }>;

	return rows.map((row) => ({
		...row,
		attending: Boolean(row.attending)
	}));
}
