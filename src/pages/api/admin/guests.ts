import type { APIRoute } from 'astro';
import { isAdminRequest } from '@/lib/adminAuth';
import { deleteGuest, updateGuestMessage } from '@/lib/db';

export const prerender = false;

function redirect(status: string) {
	return new Response(null, {
		status: 303,
		headers: { Location: `/admin?status=${status}` }
	});
}

export const POST: APIRoute = async ({ request }) => {
	if (!isAdminRequest(request)) {
		return new Response('No autorizado', { status: 401 });
	}

	const form = await request.formData();
	const action = String(form.get('action') ?? '');
	const id = Number(form.get('id'));
	if (!Number.isInteger(id) || id <= 0) return new Response('ID inválido', { status: 400 });

	if (action === 'update') {
		const message = typeof form.get('message') === 'string' ? String(form.get('message')).trim().slice(0, 550) : '';
		if (!updateGuestMessage(id, message || null)) return new Response('Registro no encontrado', { status: 404 });
		return redirect('updated');
	}

	if (action === 'clear-message') {
		if (!updateGuestMessage(id, null)) return new Response('Registro no encontrado', { status: 404 });
		return redirect('cleared');
	}

	if (action === 'delete') {
		if (!deleteGuest(id)) return new Response('Registro no encontrado', { status: 404 });
		return redirect('deleted');
	}

	return new Response('Acción inválida', { status: 400 });
};
