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

	CREATE TABLE IF NOT EXISTS app_settings (
		key TEXT PRIMARY KEY,
		value TEXT NOT NULL,
		updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS photo_uploads (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		uploader_name TEXT NOT NULL,
		original_name TEXT NOT NULL,
		stored_name TEXT NOT NULL UNIQUE,
		thumbnail_name TEXT,
		mime_type TEXT NOT NULL,
		size_bytes INTEGER NOT NULL,
		created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
`);

const photoColumns = db.prepare(`PRAGMA table_info(photo_uploads)`).all() as Array<{ name: string }>;
if (!photoColumns.some((column) => column.name === 'thumbnail_name')) {
	db.exec(`ALTER TABLE photo_uploads ADD COLUMN thumbnail_name TEXT`);
}

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

export type AdminGuest = PublicGuest & {
	dni: string;
};

export function listAdminGuests(): AdminGuest[] {
	return db.prepare(`
		SELECT id, name, dni, attending = 1 AS attending, message, created_at AS createdAt
		FROM guests
		ORDER BY datetime(created_at) DESC, id DESC
	`).all() as AdminGuest[];
}

export function updateGuestMessage(id: number, message: string | null) {
	return db.prepare(`UPDATE guests SET message = ? WHERE id = ?`).run(message, id).changes > 0;
}

export function deleteGuest(id: number) {
	return db.prepare(`DELETE FROM guests WHERE id = ?`).run(id).changes > 0;
}

export function isRsvpOpen() {
	const setting = db.prepare(`SELECT value FROM app_settings WHERE key = 'rsvp_open'`).get() as { value: string } | undefined;
	return setting?.value !== 'false';
}

export function setRsvpOpen(open: boolean) {
	db.prepare(`
		INSERT INTO app_settings (key, value, updated_at)
		VALUES ('rsvp_open', ?, CURRENT_TIMESTAMP)
		ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
	`).run(open ? 'true' : 'false');
}

export function registerPhotoUpload(input: {
	uploaderName: string;
	originalName: string;
	storedName: string;
	thumbnailName: string;
	mimeType: string;
	sizeBytes: number;
}) {
	return db.prepare(`
		INSERT INTO photo_uploads (uploader_name, original_name, stored_name, thumbnail_name, mime_type, size_bytes)
		VALUES (@uploaderName, @originalName, @storedName, @thumbnailName, @mimeType, @sizeBytes)
	`).run(input);
}

export type AdminPhoto = {
	id: number;
	uploaderName: string;
	originalName: string;
	storedName: string;
	thumbnailName: string | null;
	mimeType: string;
	sizeBytes: number;
	createdAt: string;
};

export function listAdminPhotos(): AdminPhoto[] {
	return db.prepare(`
		SELECT
			id,
			uploader_name AS uploaderName,
			original_name AS originalName,
			stored_name AS storedName,
			thumbnail_name AS thumbnailName,
			mime_type AS mimeType,
			size_bytes AS sizeBytes,
			created_at AS createdAt
		FROM photo_uploads
		ORDER BY datetime(created_at) DESC, id DESC
	`).all() as AdminPhoto[];
}

export function getAdminPhotoByStoredName(storedName: string): AdminPhoto | undefined {
	return db.prepare(`
		SELECT
			id,
			uploader_name AS uploaderName,
			original_name AS originalName,
			stored_name AS storedName,
			thumbnail_name AS thumbnailName,
			mime_type AS mimeType,
			size_bytes AS sizeBytes,
			created_at AS createdAt
		FROM photo_uploads
		WHERE stored_name = ?
	`).get(storedName) as AdminPhoto | undefined;
}

export function getPhotoById(id: number): AdminPhoto | undefined {
	return db.prepare(`
		SELECT
			id,
			uploader_name AS uploaderName,
			original_name AS originalName,
			stored_name AS storedName,
			thumbnail_name AS thumbnailName,
			mime_type AS mimeType,
			size_bytes AS sizeBytes,
			created_at AS createdAt
		FROM photo_uploads
		WHERE id = ?
	`).get(id) as AdminPhoto | undefined;
}

export function updatePhotoThumbnail(id: number, thumbnailName: string) {
	return db.prepare(`UPDATE photo_uploads SET thumbnail_name = ? WHERE id = ?`).run(thumbnailName, id).changes > 0;
}

export function listPublicPhotos() {
	return db.prepare(`
		SELECT
			id,
			uploader_name AS uploaderName,
			original_name AS originalName,
			stored_name AS storedName,
			thumbnail_name AS thumbnailName,
			mime_type AS mimeType,
			created_at AS createdAt
		FROM photo_uploads
		ORDER BY datetime(created_at) DESC, id DESC
	`).all() as Array<Pick<AdminPhoto, 'id' | 'uploaderName' | 'originalName' | 'storedName' | 'thumbnailName' | 'mimeType' | 'createdAt'>>;
}

export function deletePhoto(id: number) {
	return db.prepare(`DELETE FROM photo_uploads WHERE id = ?`).run(id).changes > 0;
}

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
