import type { APIRoute } from 'astro';
import { MAX_PHOTO_BYTES, saveUploadedPhoto } from '@/lib/photoUploads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	try {
		const contentLength = Number(request.headers.get('content-length') ?? 0);
		if (contentLength > MAX_PHOTO_BYTES + 1024 * 1024) {
			return Response.json({ error: 'Cada foto puede pesar hasta 50 MB.' }, { status: 413 });
		}

		const form = await request.formData();
		const uploaderName = typeof form.get('uploaderName') === 'string' ? String(form.get('uploaderName')).trim().slice(0, 60) : '';
		const photo = form.get('photo');

		if (uploaderName.length < 2) return Response.json({ error: 'Escribí tu nombre antes de subir las fotos.' }, { status: 400 });
		if (!(photo instanceof File)) return Response.json({ error: 'No recibimos ninguna foto.' }, { status: 400 });

		const saved = await saveUploadedPhoto(photo, uploaderName);
		return Response.json({ ok: true, ...saved }, { status: 201 });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'No pudimos guardar la foto.';
		if (message.includes('50 MB')) return Response.json({ error: message }, { status: 413 });
		if (message.includes('compatible') || message.includes('vacío')) return Response.json({ error: message }, { status: 415 });
		console.error('No se pudo guardar una foto:', error);
		return Response.json({ error: 'No pudimos guardar la foto. Intentá nuevamente.' }, { status: 500 });
	}
};
