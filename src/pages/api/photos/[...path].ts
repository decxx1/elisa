import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { getAdminPhotoByStoredName } from '@/lib/db';
import { getPhotoAbsolutePath } from '@/lib/photoUploads';

export const prerender = false;

export const GET: APIRoute = async ({ request, params }) => {
	const storedName = params.path ?? '';
	const photo = getAdminPhotoByStoredName(storedName);
	if (!photo) return new Response('Foto no encontrada.', { status: 404 });

	try {
		const bytes = await readFile(getPhotoAbsolutePath(photo.storedName));
		const download = new URL(request.url).searchParams.get('download') === '1';
		return new Response(bytes, {
			headers: {
				'Cache-Control': 'public, max-age=300',
				'Content-Type': photo.mimeType,
				'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${photo.originalName.replace(/["\\\r\n]/g, '_')}"`,
				'X-Content-Type-Options': 'nosniff'
			}
		});
	} catch {
		return new Response('Archivo no encontrado.', { status: 404 });
	}
};
