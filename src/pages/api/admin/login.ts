import type { APIRoute } from 'astro';
import { authenticateAdmin, createAdminSession, getAdminSessionCookie } from '@/lib/adminAuth';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const form = await request.formData();
	const username = typeof form.get('username') === 'string' ? String(form.get('username')).trim() : '';
	const password = typeof form.get('password') === 'string' ? String(form.get('password')) : '';

	if (!authenticateAdmin(username, password)) {
		return new Response(null, {
			status: 303,
			headers: { Location: '/admin?error=invalid' }
		});
	}

	return new Response(null, {
		status: 303,
		headers: {
			Location: '/admin',
			'Set-Cookie': getAdminSessionCookie(request, createAdminSession(username))
		}
	});
};
