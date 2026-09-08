import type { APIRoute } from 'astro';
import { isAdminRequest } from '@/lib/adminAuth';
import { setPhotoUploadOpen, setRsvpOpen } from '@/lib/db';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	if (!isAdminRequest(request)) return new Response('No autorizado', { status: 401 });

	const form = await request.formData();
	const setting = String(form.get('setting') ?? 'rsvp');

	if (setting === 'photos') {
		const photoUploadOpen = form.get('photoUploadOpen') === 'true';
		setPhotoUploadOpen(photoUploadOpen);

		return new Response(null, {
			status: 303,
			headers: { Location: `/admin?status=${photoUploadOpen ? 'photos-opened' : 'photos-closed'}` }
		});
	}

	const rsvpOpen = form.get('rsvpOpen') === 'true';
	setRsvpOpen(rsvpOpen);

	return new Response(null, {
		status: 303,
		headers: { Location: `/admin?status=${rsvpOpen ? 'rsvp-opened' : 'rsvp-closed'}` }
	});
};
