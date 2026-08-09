import type { APIRoute } from 'astro';
import { getExpiredAdminSessionCookie } from '@/lib/adminAuth';

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
	new Response(null, {
		status: 303,
		headers: {
			Location: '/admin',
			'Set-Cookie': getExpiredAdminSessionCookie(request)
		}
	});
