import type { APIRoute } from 'astro';
import { getGuestStats, listGuestbookGuests, registerGuest } from '@/lib/db';

export const prerender = false;

const NAME_MAX = 35;
const MESSAGE_MAX = 550;

export const GET: APIRoute = () => {
	const stats = getGuestStats();
	return Response.json({
		...stats,
		guests: listGuestbookGuests()
	});
};

export const POST: APIRoute = async ({ request }) => {
	try {
		const body = await request.json() as {
			name?: unknown;
			attending?: unknown;
			message?: unknown;
		};
		const name = typeof body.name === 'string' ? body.name.trim() : '';
		const message = typeof body.message === 'string' ? body.message.trim().slice(0, MESSAGE_MAX) : '';
		const attending = body.attending === true;

		if (name.length < 2 || name.length > NAME_MAX) {
			return Response.json({ error: `El nombre debe tener entre 2 y ${NAME_MAX} caracteres.` }, { status: 400 });
		}

		if (message.length > MESSAGE_MAX) {
			return Response.json({ error: `El mensaje puede tener hasta ${MESSAGE_MAX} caracteres.` }, { status: 400 });
		}

		try {
			const guest = registerGuest({ name, attending, message });
			const stats = getGuestStats();
			return Response.json({
				guest: {
					id: guest.id,
					name: guest.name,
					message: guest.message,
					createdAt: guest.createdAt,
					attending: Boolean(guest.attending)
				},
				stats,
				guests: listGuestbookGuests()
			}, { status: 201 });
		} catch {
			return Response.json({ error: 'No pudimos guardar tu pase.' }, { status: 500 });
		}
	} catch {
		return Response.json({ error: 'No pudimos procesar tu registro.' }, { status: 400 });
	}
};
