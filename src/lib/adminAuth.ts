import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'elisa_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getEnv(name: string) {
	return process.env[name] ?? import.meta.env[name] ?? '';
}

function getSessionSecret() {
	return getEnv('ADMIN_SESSION_SECRET') || getEnv('ADMIN_PASSWORD');
}

function safeEqual(left: string, right: string) {
	const leftBuffer = Buffer.from(left);
	const rightBuffer = Buffer.from(right);
	if (leftBuffer.length !== rightBuffer.length) return false;
	return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(payload: string) {
	return createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
}

export function isAdminConfigured() {
	return Boolean(getEnv('ADMIN_USERNAME') && getEnv('ADMIN_PASSWORD') && getSessionSecret());
}

export function authenticateAdmin(username: string, password: string) {
	const expectedUsername = getEnv('ADMIN_USERNAME');
	const expectedPassword = getEnv('ADMIN_PASSWORD');
	return isAdminConfigured() && safeEqual(username, expectedUsername) && safeEqual(password, expectedPassword);
}

export function createAdminSession(username: string) {
	const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
	const payload = Buffer.from(JSON.stringify({ username, expiresAt })).toString('base64url');
	return `${payload}.${sign(payload)}`;
}

export function isAdminSessionValid(token: string | null | undefined) {
	if (!token || !isAdminConfigured()) return false;
	const parts = token.split('.');
	if (parts.length !== 2) return false;

	const [payload, signature] = parts;
	try {
		const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
			username?: unknown;
			expiresAt?: unknown;
		};
		const username = typeof session.username === 'string' ? session.username : '';
		const expiresAt = typeof session.expiresAt === 'number' ? session.expiresAt : 0;
		const expectedUsername = getEnv('ADMIN_USERNAME');
		if (!username || !signature || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;
		return safeEqual(username, expectedUsername) && safeEqual(signature, sign(payload));
	} catch {
		return false;
	}
}

export function getAdminSessionFromRequest(request: Request) {
	const cookieHeader = request.headers.get('cookie') ?? '';
	const cookie = cookieHeader.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
	return cookie ? decodeURIComponent(cookie.slice(COOKIE_NAME.length + 1)) : null;
}

export function isAdminRequest(request: Request) {
	return isAdminSessionValid(getAdminSessionFromRequest(request));
}

export function getAdminSessionCookie(request: Request, token: string) {
	const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
	return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Strict${secure}`;
}

export function getExpiredAdminSessionCookie(request: Request) {
	const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
	return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${secure}`;
}
