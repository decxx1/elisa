import type { APIRoute } from 'astro';
import { isAdminRequest } from '@/lib/adminAuth';
import { deletePhoto, getAdminPhotoByStoredName } from '@/lib/db';
import { removeUploadedPhoto } from '@/lib/photoUploads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (!isAdminRequest(request)) return new Response('No autorizado', { status: 401 });

	const form = await request.formData();
	const action = String(form.get('action') ?? '');
	const id = Number(form.get('id'));
	if (action !== 'delete' || !Number.isInteger(id) || id <= 0) return new Response('Solicitud inválida', { status: 400 });

	const photo = getAdminPhotoByStoredName(String(form.get('storedName') ?? ''));
	if (!photo || photo.id !== id) return new Response('Foto no encontrada', { status: 404 });

	try {
		await removeUploadedPhoto(photo.storedName, photo.thumbnailName);
		if (!deletePhoto(photo.id)) return new Response('Foto no encontrada', { status: 404 });
	} catch (error) {
		console.error('No se pudo eliminar una foto:', error);
		return new Response('No se pudo eliminar la foto', { status: 500 });
	}

	return new Response(null, {
		status: 303,
		headers: { Location: '/admin?status=photo-deleted' }
	});
};
