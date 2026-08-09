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
	const payload = `${username}.${expiresAt}`;
	return `${payload}.${sign(payload)}`;
}

export function isAdminSessionValid(token: string | null | undefined) {
	if (!token || !isAdminConfigured()) return false;
	const parts = token.split('.');
	if (parts.length !== 3) return false;

	const [username, expiresAtText, signature] = parts;
	const expiresAt = Number(expiresAtText);
	if (!username || !signature || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) return false;

	const expectedUsername = getEnv('ADMIN_USERNAME');
	const payload = `${username}.${expiresAtText}`;
	return safeEqual(username, expectedUsername) && safeEqual(signature, sign(payload));
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
