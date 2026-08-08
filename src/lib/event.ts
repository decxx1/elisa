export const eventDate = new Date('2026-08-19T13:00:00-03:00').getTime();
export const eventDayEnd = new Date('2026-08-20T00:00:00-03:00').getTime();

export type Countdown = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

export type CountdownPhase = 'upcoming' | 'live' | 'ended';

export type CountdownState = {
	phase: CountdownPhase;
	countdown: Countdown;
};

export function getCountdownState(): CountdownState {
	const now = Date.now();
	if (now >= eventDayEnd) {
		return { phase: 'ended', countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
	}
	if (now >= eventDate) {
		return { phase: 'live', countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
	}
	const distance = eventDate - now;
	return {
		phase: 'upcoming',
		countdown: {
			days: Math.floor(distance / 86_400_000),
			hours: Math.floor((distance / 3_600_000) % 24),
			minutes: Math.floor((distance / 60_000) % 60),
			seconds: Math.floor((distance / 1_000) % 60)
		}
	};
}

export function pad(value: number) {
	return String(value).padStart(2, '0');
}

export const MAP_EMBED_SRC =
	'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1492.962987763776!2d-68.84652986249834!3d-32.85614559472485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09003068852b%3A0xa209b7a00a1d3ea8!2sCasa%20quincho%20MC!5e0!3m2!1ses!2sar!4v1786203938011!5m2!1ses!2sar';

export const MAP_LINK = 'https://maps.app.goo.gl/FEu7q1ZGinBr3o7A6';
