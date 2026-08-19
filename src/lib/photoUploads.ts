import { randomUUID } from 'node:crypto';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { registerPhotoUpload, updatePhotoThumbnail, type AdminPhoto } from '@/lib/db';

export const MAX_PHOTO_BYTES = 50 * 1024 * 1024;

function getEnv(name: string) {
	return process.env[name] ?? import.meta.env[name] ?? '';
}

export function getUploadRoot() {
	const databasePath = getEnv('DATABASE_PATH') || './data/app.db';
	return getEnv('UPLOAD_DIR') || join(dirname(databasePath), 'uploads');
}

export function getPhotoAbsolutePath(storedName: string) {
	const uploadRoot = getUploadRoot();
	const absoluteRoot = join(uploadRoot);
	const absolutePath = join(absoluteRoot, storedName);
	if (absolutePath !== absoluteRoot && !absolutePath.startsWith(`${absoluteRoot}/`) && !absolutePath.startsWith(`${absoluteRoot}\\`)) {
		throw new Error('Ruta de foto inválida.');
	}
	return absolutePath;
}

export async function removeUploadedPhoto(storedName: string, thumbnailName?: string | null) {
	await Promise.all([
		rm(getPhotoAbsolutePath(storedName), { force: true }),
		thumbnailName ? rm(getPhotoAbsolutePath(thumbnailName), { force: true }) : Promise.resolve()
	]);
}

async function createThumbnail(input: Uint8Array | string, thumbnailName: string) {
	const thumbnailPath = getPhotoAbsolutePath(thumbnailName);
	await mkdir(dirname(thumbnailPath), { recursive: true });
	await sharp(input, { animated: false })
		.rotate()
		.resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
		.webp({ quality: 78, effort: 4 })
		.toFile(thumbnailPath);
}

export async function ensurePhotoThumbnail(photo: AdminPhoto) {
	if (photo.thumbnailName) return photo.thumbnailName;
	const folder = dirname(photo.storedName).replace(/\\/g, '/');
	const thumbnailName = `${folder}/thumbs/${photo.id}.webp`;
	await createThumbnail(getPhotoAbsolutePath(photo.storedName), thumbnailName);
	updatePhotoThumbnail(photo.id, thumbnailName);
	return thumbnailName;
}

function detectImageExtension(bytes: Uint8Array) {
	if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { extension: 'jpg', mimeType: 'image/jpeg' };
	if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return { extension: 'png', mimeType: 'image/png' };

	const signature = String.fromCharCode(...bytes.slice(0, 16));
	if (signature.startsWith('GIF87a') || signature.startsWith('GIF89a')) return { extension: 'gif', mimeType: 'image/gif' };
	if (signature.startsWith('RIFF') && signature.slice(8, 12) === 'WEBP') return { extension: 'webp', mimeType: 'image/webp' };
	if (signature.slice(4, 8) === 'ftyp') {
		const brand = signature.slice(8, 12).toLowerCase();
		if (brand === 'avif' || brand === 'avis') return { extension: 'avif', mimeType: 'image/avif' };
		if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) return { extension: 'heic', mimeType: 'image/heic' };
	}

	return null;
}

export async function saveUploadedPhoto(file: File, uploaderName: string) {
	if (file.size <= 0) throw new Error('El archivo está vacío.');
	if (file.size > MAX_PHOTO_BYTES) throw new Error('Cada foto puede pesar hasta 50 MB.');

	const bytes = new Uint8Array(await file.arrayBuffer());
	const detected = detectImageExtension(bytes);
	if (!detected) throw new Error('El archivo no parece ser una imagen compatible.');

	const now = new Date();
	const folder = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
	const fileId = randomUUID();
	const storedName = `${folder}/${fileId}.${detected.extension}`;
	const thumbnailName = `${folder}/thumbs/${fileId}.webp`;
	const absolutePath = join(getUploadRoot(), storedName);
	await mkdir(dirname(absolutePath), { recursive: true });
	await writeFile(absolutePath, bytes, { flag: 'wx' });

	try {
		await createThumbnail(bytes, thumbnailName);
		registerPhotoUpload({
			uploaderName,
			originalName: file.name.slice(0, 255) || `foto.${detected.extension}`,
			storedName,
			thumbnailName,
			mimeType: detected.mimeType,
			sizeBytes: file.size
		});
	} catch (error) {
		await removeUploadedPhoto(storedName, thumbnailName);
		throw error;
	}

	return { storedName, sizeBytes: file.size };
}
