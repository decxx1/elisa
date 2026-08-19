import type { APIRoute } from 'astro';
import { ZipArchive } from 'archiver';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { listAdminPhotos } from '@/lib/db';
import { getPhotoAbsolutePath } from '@/lib/photoUploads';

export const prerender = false;

function safeFileName(value: string) {
	return value.replace(/[\\/:*?"<>|\r\n]/g, '_').slice(0, 180) || 'foto';
}

export const GET: APIRoute = async () => {
	const photos = listAdminPhotos();
	if (!photos.length) return new Response('Todavía no hay fotos.', { status: 404 });

	const archive = new ZipArchive({ zlib: { level: 0 } });
	archive.on('warning', (error) => console.warn('Advertencia al crear el ZIP:', error));
	archive.on('error', (error) => archive.destroy(error));

	photos.forEach((photo, index) => {
		archive.append(createReadStream(getPhotoAbsolutePath(photo.storedName)), {
			name: `${String(index + 1).padStart(3, '0')}-${safeFileName(photo.originalName)}`
		});
	});
	void archive.finalize();

	return new Response(Readable.toWeb(archive) as ReadableStream, {
		headers: {
			'Cache-Control': 'no-store',
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="fotos-elisa.zip"'
		}
	});
};
