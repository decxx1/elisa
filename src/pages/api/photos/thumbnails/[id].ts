import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { getPhotoById } from '@/lib/db';
import { ensurePhotoThumbnail, getPhotoAbsolutePath } from '@/lib/photoUploads';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id <= 0) return new Response('Miniatura no encontrada.', { status: 404 });
	const photo = getPhotoById(id);
	if (!photo) return new Response('Miniatura no encontrada.', { status: 404 });

	try {
		const thumbnailName = await ensurePhotoThumbnail(photo);
		const bytes = await readFile(getPhotoAbsolutePath(thumbnailName));
		return new Response(bytes, {
			headers: {
				'Cache-Control': 'public, max-age=31536000, immutable',
				'Content-Type': 'image/webp',
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch (error) {
		console.error('No se pudo servir una miniatura:', error);
		return new Response('Miniatura no disponible.', { status: 404 });
	}
};
