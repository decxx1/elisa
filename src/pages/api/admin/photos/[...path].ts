import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { getAdminPhotoByStoredName } from '@/lib/db';
import { getPhotoAbsolutePath } from '@/lib/photoUploads';
import { isAdminRequest } from '@/lib/adminAuth';

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
	if (!isAdminRequest(request)) return new Response('No autorizado.', { status: 401 });

	const storedName = params.path ?? '';
	const photo = getAdminPhotoByStoredName(storedName);
	if (!photo) return new Response('Foto no encontrada.', { status: 404 });

	try {
		const bytes = await readFile(getPhotoAbsolutePath(photo.storedName));
		return new Response(bytes, {
			headers: {
				'Cache-Control': 'private, max-age=300',
				'Content-Type': photo.mimeType,
				'Content-Disposition': `inline; filename="${photo.originalName.replace(/["\\\r\n]/g, '_')}"`,
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch {
		return new Response('Archivo no encontrado.', { status: 404 });
	}
};
