import { Icon } from '@iconify/react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import SiteHeader from '@/components/SiteHeader';
import MobileTabBar from '@/components/MobileTabBar';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const eventDate = new Date('2026-08-19T13:00:00-03:00').getTime();

type Countdown = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
};

type RsvpForm = {
	name: string;
	attending: boolean;
	message: string;
};

type RsvpStatus = {
	type: 'idle' | 'success' | 'error';
	message: string;
};

type GuestNote = {
	id: number;
	name: string;
	message: string | null;
	attending: boolean;
	createdAt: string;
};

type GuestbookFilter = 'all' | 'confirmed' | 'declined';
type GuestbookSort = 'newest' | 'oldest';

type AttireLightbox = {
	src: string;
	alt: string;
	label: string;
	detail: string;
};

const attireLooks: AttireLightbox[] = [
	{
		src: '/images/art-deco-woman-attire.png',
		alt: 'Ejemplo de vestimenta Art Déco para mujer: vestido con flecos, perlas y tocado',
		label: 'Ella',
		detail: 'Flapper · 1924'
	},
	{
		src: '/images/art-deco-man-attire.png',
		alt: 'Ejemplo de vestimenta Art Déco para hombre: traje claro, corbata y fedora',
		label: 'Él',
		detail: 'Caballero · 1924'
	}
];

function getVisibleGuests(guests: GuestNote[], filter: GuestbookFilter, sort: GuestbookSort) {
	const filtered = guests.filter((guest) => {
		const attending = Boolean(guest.attending);
		if (filter === 'confirmed') return attending;
		if (filter === 'declined') return !attending;
		return true;
	});

	return filtered.slice().sort((a, b) => {
		const left = new Date(a.createdAt).getTime();
		const right = new Date(b.createdAt).getTime();
		return sort === 'newest' ? right - left : left - right;
	});
}

function getCountdown(): Countdown {
	const distance = Math.max(0, eventDate - Date.now());
	return {
		days: Math.floor(distance / 86_400_000),
		hours: Math.floor((distance / 3_600_000) % 24),
		minutes: Math.floor((distance / 60_000) % 60),
		seconds: Math.floor((distance / 1_000) % 60)
	};
}

function pad(value: number) {
	return String(value).padStart(2, '0');
}

const MAP_EMBED_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1492.962987763776!2d-68.84652986249834!3d-32.85614559472485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e09003068852b%3A0xa209b7a00a1d3ea8!2sCasa%20quincho%20MC!5e0!3m2!1ses!2sar!4v1786203938011!5m2!1ses!2sar';
const MAP_LINK = 'https://maps.app.goo.gl/FEu7q1ZGinBr3o7A6';

const NAME_MAX = 35;
const MESSAGE_MAX = 550;

export default function ArtDecoLanding() {
	const rootRef = useRef<HTMLDivElement>(null);
	const [countdown, setCountdown] = useState<Countdown | null>(null);
	const [musicPlaying, setMusicPlaying] = useState(false);
	const [form, setForm] = useState<RsvpForm>({ name: '', attending: true, message: '' });
	const [status, setStatus] = useState<RsvpStatus>({ type: 'idle', message: '' });
	const [stats, setStats] = useState({ total: 0, confirmed: 0 });
	const [guests, setGuests] = useState<GuestNote[]>([]);
	const [guestbookOpen, setGuestbookOpen] = useState(false);
	const [locationModalOpen, setLocationModalOpen] = useState(false);
	const [guestbookModalOpen, setGuestbookModalOpen] = useState(false);
	const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
	const [guestbookFilter, setGuestbookFilter] = useState<GuestbookFilter>('all');
	const [guestbookSort, setGuestbookSort] = useState<GuestbookSort>('newest');
	const [activeGuestId, setActiveGuestId] = useState<number | null>(null);
	const [saving, setSaving] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [attireLightbox, setAttireLightbox] = useState<AttireLightbox | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const visibleGuests = getVisibleGuests(guests, guestbookFilter, guestbookSort);

	async function loadGuestbook() {
		try {
			const response = await fetch('/api/rsvp');
			const data = await response.json();
			setStats({ total: data.total ?? 0, confirmed: data.confirmed ?? 0 });
			setGuests(Array.isArray(data.guests) ? data.guests : []);
		} catch {
			/* ignore network errors while idle */
		}
	}

	useEffect(() => {
		setCountdown(getCountdown());
		const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
		void loadGuestbook();
		const refresh = window.setInterval(() => void loadGuestbook(), 45_000);

		return () => {
			window.clearInterval(timer);
			window.clearInterval(refresh);
		};
	}, []);

	useEffect(() => {
		if (!guestbookOpen && !guestbookModalOpen && !rsvpModalOpen && !attireLightbox && !locationModalOpen) return;
		function onKey(event: KeyboardEvent) {
			if (event.key !== 'Escape') return;
			if (attireLightbox) setAttireLightbox(null);
			else if (rsvpModalOpen) setRsvpModalOpen(false);
			else if (locationModalOpen) setLocationModalOpen(false);
			else if (guestbookModalOpen) setGuestbookModalOpen(false);
			else setGuestbookOpen(false);
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [guestbookOpen, guestbookModalOpen, rsvpModalOpen, attireLightbox, locationModalOpen]);

	useEffect(() => {
		if (!guestbookModalOpen && !rsvpModalOpen && !attireLightbox && !locationModalOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	}, [guestbookModalOpen, rsvpModalOpen, attireLightbox, locationModalOpen]);

	useEffect(() => {
		const list = getVisibleGuests(guests, guestbookFilter, guestbookSort);
		if (!list.length) {
			setActiveGuestId(null);
			return;
		}
		if (activeGuestId == null || !list.some((guest) => guest.id === activeGuestId)) {
			setActiveGuestId(list[0].id);
		}
	}, [guests, guestbookFilter, guestbookSort, activeGuestId]);

	useEffect(() => {
		if (!guestbookOpen || guestbookModalOpen) return;
		const list = getVisibleGuests(guests, guestbookFilter, guestbookSort);
		if (list.length < 2) return;
		const rotate = window.setInterval(() => {
			setActiveGuestId((current) => {
				const index = list.findIndex((guest) => guest.id === current);
				const next = list[(index + 1) % list.length];
				return next?.id ?? list[0].id;
			});
		}, 4500);
		return () => window.clearInterval(rotate);
	}, [guestbookOpen, guestbookModalOpen, guests, guestbookFilter, guestbookSort]);

	useEffect(() => {
		if (!guestbookOpen || activeGuestId == null) return;
		document.querySelector(`[data-guest-id="${activeGuestId}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}, [activeGuestId, guestbookOpen]);

	useGSAP(() => {
		const media = gsap.matchMedia();
		media.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.from('.hero-copy > *', {
				opacity: 0,
				y: 26,
				stagger: 0.12,
				duration: 0.9,
				ease: 'power3.out'
			});
			gsap.from('.hero-art', { opacity: 0, scale: 1.08, duration: 1.5, ease: 'power2.out' });
			gsap.to('.hero-art', {
				yPercent: 8,
				ease: 'none',
				scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
			});
			gsap.to('.ornament-float', {
				yPercent: -20,
				ease: 'none',
				scrollTrigger: { trigger: '.hero-section', start: 'top bottom', end: 'bottom top', scrub: true }
			});
			gsap.to('.scroll-progress', {
				scaleX: 1,
				ease: 'none',
				transformOrigin: 'left center',
				scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
			});
			ScrollTrigger.batch('.reveal', {
				start: 'top 88%',
				onEnter: (elements) => gsap.from(elements, {
					opacity: 0,
					y: 34,
					stagger: 0.08,
					duration: 0.8,
					ease: 'power3.out'
				})
			});
		});

		return () => media.revert();
	}, { scope: rootRef });

	useEffect(() => () => stopMusic(), []);

	function startMusic() {
		const audio = audioRef.current ?? new Audio('/sounds/glenn-miller-In-the-mood.m4a');
		audio.loop = true;
		audio.volume = 0.5;
		audioRef.current = audio;
		void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
	}

	function stopMusic() {
		const audio = audioRef.current;
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		setMusicPlaying(false);
	}

	function toggleMusic() {
		if (musicPlaying) stopMusic();
		else startMusic();
	}

	function updateForm(field: keyof RsvpForm, value: string | boolean) {
		setForm((current) => {
			if (field === 'name' && typeof value === 'string') {
				return { ...current, name: value.slice(0, NAME_MAX) };
			}
			if (field === 'message' && typeof value === 'string') {
				return { ...current, message: value.slice(0, MESSAGE_MAX) };
			}
			return { ...current, [field]: value };
		});
	}

	function openGuestbookModal(guestId?: number) {
		if (guestId != null) setActiveGuestId(guestId);
		setGuestbookModalOpen(true);
		void loadGuestbook();
	}

	async function submitRsvp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setStatus({ type: 'idle', message: '' });
		try {
			const response = await fetch('/api/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? 'No pudimos guardar tu pase.');
			setStats(data.stats);
			if (Array.isArray(data.guests)) setGuests(data.guests);
			else void loadGuestbook();
			setStatus({ type: 'success', message: form.attending ? 'Tu nombre ya está en la lista dorada.' : 'Anotamos que no vas a poder asistir. ¡Gracias por el saludo!' });
			setForm({ name: '', attending: true, message: '' });
			setRsvpModalOpen(false);
			if (form.attending || Boolean(form.message.trim())) setGuestbookOpen(true);
		} catch (cause) {
			setStatus({ type: 'error', message: cause instanceof Error ? cause.message : 'No pudimos guardar tu pase.' });
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="min-h-screen overflow-hidden bg-ink pb-20 text-ivory selection:bg-gold selection:text-ink lg:pb-0" ref={rootRef}>
			<div className="scroll-progress" />
			<SiteHeader musicPlaying={musicPlaying} onToggleMusic={toggleMusic} />

			<main>
				<section className="hero-section relative isolate flex min-h-[100svh] items-center overflow-hidden px-6 pb-28 pt-28 sm:px-12 lg:min-h-[min(900px,100svh)] lg:items-end lg:px-20 lg:pb-20 lg:pt-32" id="inicio">
					<img className="hero-art absolute inset-0 -z-20 h-[115%] w-full object-cover object-center" src="/images/art-deco-jazz-club.png" alt="Salón de jazz Art Déco con piano y micrófono antiguo" />
					<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,5,5,.40)_0%,rgba(3,5,5,.34)_40%,rgba(3,5,5,.18)_100%)]" />
					<div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#050605_0%,transparent_46%,rgba(3,5,5,.2)_100%)]" />
					
					<div className="relative z-10 mx-auto w-full max-w-7xl">
						<div className="hero-copy mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
							<p className="mb-6 flex items-center justify-center gap-3 font-ui text-[11px] font-bold uppercase tracking-[0.42em] text-gold lg:justify-start"><span className="h-px w-10 shrink-0 bg-gold" /> <span>Invitación privada · <span className="whitespace-nowrap">1924 / 2026</span></span></p>
							<h1 className="font-display text-[clamp(6.75rem,20vw,14rem)] leading-[.72] tracking-[-.08em] text-ivory">Elisa<span className="text-gold">.</span></h1>
							<p className="mx-auto mt-8 max-w-xl font-serif text-3xl leading-tight text-ivory/85 sm:text-4xl lg:mx-0">¡Adentrémonos en los dorados años 20!</p>
							<div className="mt-10 hidden flex-wrap items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.2em] lg:flex">
								<a className="group inline-flex items-center gap-3 bg-gold px-5 py-4 text-ink transition hover:bg-ivory" href="#rsvp">Reservar mi lugar <Icon className="transition-transform group-hover:translate-x-1" icon="lucide:arrow-up-right" width="16" /></a>
								<a className="inline-flex items-center gap-3 border border-ivory/30 px-5 py-4 text-ivory transition hover:border-gold hover:text-gold" href="#historia">Abrir el expediente <Icon icon="lucide:scroll-text" width="16" /></a>
							</div>
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="historia">
					<div className="deco-sunburst absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-20" aria-hidden="true" />
					<div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
						<div className="reveal lg:sticky lg:top-32 lg:h-fit">
							<p className="eyebrow text-ink/55">Desde 1924</p>
							<h2 className="mt-5 max-w-md font-display text-6xl leading-[.88] tracking-[-.05em] text-ink sm:text-8xl">Una vida<br /><span className="text-gold-dark">102 años</span></h2>
							<div className="mt-10 flex items-center gap-3 font-ui text-[10px] font-bold uppercase tracking-[.25em] text-gold-dark"><span className="h-px w-8 bg-gold-dark" /> Te espero</div>
						</div>
						<div className="relative space-y-14 font-serif text-2xl leading-[1.25] text-ink/70 sm:text-3xl">
							<div className="deco-corner reveal absolute -right-5 -top-8 hidden size-28 border-r border-t border-gold-dark/60 sm:block" aria-hidden="true" />
							<p className="reveal">El tiempo pasa, pero el estilo y la alegría permanecen.</p>
							<p className="reveal text-ink">Te espero para hacer un viaje a la época del jazz y celebrar juntos mis <span className="text-gold-dark">102 años</span>.</p>
							<div className="reveal grid gap-3 border-y border-ink/15 py-6 font-ui text-xs font-medium uppercase tracking-[.18em] text-ink/60 sm:grid-cols-3">
								<span className="flex items-center gap-2"><Icon className="text-gold-dark" icon="lucide:sparkles" width="16" /> Años dorados</span>
								<span className="flex items-center gap-2"><Icon className="text-gold-dark" icon="lucide:feather" width="16" /> Estilo flapper</span>
								<span className="flex items-center gap-2"><Icon className="text-gold-dark" icon="lucide:music" width="16" /> Jazz y charleston</span>
							</div>
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-ink px-6 py-24 text-ivory sm:px-12 lg:px-20" id="vestimenta">
					<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
					<div className="relative mx-auto max-w-7xl">
						<div className="reveal flex flex-col justify-between gap-8 border-b border-ivory/15 pb-10 lg:flex-row lg:items-end">
							<div className="max-w-2xl">
								<p className="eyebrow">Código de vestimenta</p>
								<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">Lucí tu<br /><span className="text-gold">mejor época.</span></h2>
							</div>
							<p className="max-w-xs font-ui text-[10px] font-bold uppercase tracking-[.24em] text-ivory/45 lg:text-right">
								Inspiración · Años 20
								<span className="hidden sm:inline"><br /><span className="text-ivory">Ella &amp; Él</span></span>
							</p>
						</div>

						<div className="reveal mt-12 grid gap-10 border-b border-ivory/15 pb-12 lg:grid-cols-[1fr_.9fr] lg:gap-20">
							<div className="space-y-6 font-serif text-2xl leading-[1.3] text-ivory/75 sm:text-3xl">
								<p>Te invitamos a lucir tu mejor atuendo de la época.</p>
								<p>¿No tenés disfraz? <span className="text-gold">¡Cero drama!</span> Esperamos por vos con un rincón lleno de sombreros, plumas, collares y moños para que te lookees al llegar.</p>
							</div>
							<div className="flex flex-col justify-between gap-8 lg:border-l lg:border-ivory/15 lg:pl-12">
								<div className="flex flex-wrap gap-x-6 gap-y-3 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ivory/50">
									<span className="flex items-center gap-2"><Icon className="text-gold" icon="lucide:hat-glasses" width="16" /> Sombreros</span>
									<span className="flex items-center gap-2"><Icon className="text-gold" icon="lucide:feather" width="16" /> Plumas</span>
									<span className="flex items-center gap-2"><Icon className="text-gold" icon="lucide:gem" width="16" /> Collares</span>
									<span className="flex items-center gap-2"><Icon className="text-gold" icon="lucide:ribbon" width="16" /> Moños</span>
								</div>
								<p className="font-display text-4xl leading-[.9] tracking-[-.04em] text-ivory sm:text-5xl">¡Lo importante es tu presencia<span className="text-gold">!</span></p>
							</div>
						</div>

						<div className="mt-14 grid gap-8 sm:grid-cols-2 sm:gap-10">
							{attireLooks.map((look) => (
								<figure className="reveal group relative" key={look.src}>
									<div className="deco-frame absolute -inset-4 border border-gold/35 sm:-inset-5" aria-hidden="true" />
									<button
										className="relative aspect-[3/4] w-full overflow-hidden bg-[#181b19] text-left"
										type="button"
										onClick={() => setAttireLightbox(look)}
										aria-label={`Ver ${look.label} a pantalla completa`}
									>
										<img className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" src={look.src} alt={look.alt} loading="lazy" />
										<div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,6,5,.55)_100%)]" />
										<span className="absolute right-4 top-4 inline-flex items-center gap-1.5 border border-ivory/25 bg-ink/50 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.2em] text-ivory/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
											<Icon icon="lucide:expand" width="12" /> Ver
										</span>
										<span className="absolute bottom-5 left-5 right-5 flex items-end justify-between font-ui text-[10px] font-bold uppercase tracking-[.28em] text-ivory">
											<span>{look.label}</span>
											<span className="text-gold">{look.detail}</span>
										</span>
									</button>
								</figure>
							))}
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-gold px-6 py-24 text-ink sm:px-12 lg:px-20" id="programa">
					<div className="pointer-events-none absolute -right-16 top-8 size-72 rounded-full border border-ink/10 sm:size-[28rem]" aria-hidden="true" />
					<div className="pointer-events-none absolute -right-4 top-20 size-48 rounded-full border border-ink/20 sm:size-[20rem]" aria-hidden="true" />
					<div className="relative mx-auto max-w-7xl">
						<div className="reveal grid gap-16 lg:grid-cols-2 lg:gap-24">
							<div>
								<p className="eyebrow text-ink/55">Brindis &amp; banquete</p>
								<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">El menú<br /><span className="text-ivory">del día.</span></h2>
								<p className="mt-8 max-w-md font-serif text-2xl leading-tight text-ink/70">Disfrutemos un buen asado, sigamos brindando con dulces y cerremos con la infaltable torta.</p>
								<ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/20 pt-8 font-ui text-xs font-bold uppercase tracking-[.2em]">
									<li className="flex items-center gap-3"><Icon className="text-ink/70" icon="lucide:beef" width="16" /> Buen asado</li>
									<li className="flex items-center gap-3"><Icon className="text-ink/70" icon="lucide:wine" width="16" /> Bebidas legales</li>
									<li className="flex items-center gap-3"><Icon className="text-ink/70" icon="lucide:cake-slice" width="16" /> Torta y dulces</li>
								</ul>
							</div>
							<div>
								<p className="eyebrow text-ink/55">Hasta que llegue el gran día</p>
								<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">La cuenta<br />regresiva<span className="text-ivory">.</span></h2>
								<div className="mt-10 grid grid-cols-4 gap-3 border-t border-ink/20 pt-8 font-ui sm:gap-6">
									{[['days', 'días'], ['hours', 'horas'], ['minutes', 'min'], ['seconds', 'seg']].map(([key, label]) => (
										<div className="text-center" key={key}>
											<p className="font-display text-5xl sm:text-7xl">{countdown ? pad(countdown[key as keyof Countdown]) : '--'}</p>
											<p className="mt-2 text-[9px] font-bold uppercase tracking-[.2em] text-ink/55">{label}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="relative overflow-hidden bg-ink px-6 py-24 sm:px-12 lg:px-20" id="contrasena">
					<div className="deco-sunburst absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 -translate-y-1/3 opacity-15" aria-hidden="true" />
					<div className="pointer-events-none absolute inset-x-8 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:block" aria-hidden="true" />
					<div className="relative mx-auto max-w-4xl">
						<div className="reveal text-center">
							<h2 className="font-display text-6xl leading-[.88] tracking-[-.05em] text-ivory sm:text-8xl">El piso de<br /><span className="text-gold">arriba.</span></h2>
						</div>

						<div className="reveal mt-14 space-y-8 border-y border-ivory/15 py-12 text-center font-serif text-2xl leading-[1.35] text-ivory/75 sm:text-3xl">
							<p className="inline-flex items-center justify-center gap-3 border border-gold/50 px-4 py-2 font-ui text-[10px] font-bold uppercase tracking-[.32em] text-gold">
								<Icon icon="lucide:siren" width="14" /> Atención
							</p>
							<p>Circulan rumores de que las autoridades vigilan la zona.</p>
						</div>
						<div className="reveal space-y-8 border-b border-ivory/15 py-12 text-center font-serif text-2xl leading-[1.35] text-ivory/75 sm:text-3xl">
							<p>
								El almuerzo en el restaurante Elisa es completamente legal: fingiremos ser ciudadanos ejemplares.
								Pero si ves una escalera y querés acceder arriba, deberás convencer al portero.
							</p>
						</div>

						<div className="reveal mx-auto mt-12 max-w-xl text-center">
							<p className="font-ui text-[10px] font-bold uppercase tracking-[.28em] text-ivory/45">La contraseña es</p>
							<button
								className="mt-5 flex w-full items-center justify-between border border-gold/60 px-5 py-5 text-left transition hover:bg-gold hover:text-ink"
								type="button"
								onClick={() => setPasswordVisible((visible) => !visible)}
								aria-expanded={passwordVisible}
							>
								<span className="font-ui text-sm font-bold uppercase tracking-[.28em]">
									{passwordVisible ? 'AlCapone' : 'Tocar para revelar'}
								</span>
								<Icon icon={passwordVisible ? 'lucide:eye-off' : 'lucide:key-round'} width="18" />
							</button>
							<p className="mt-4 font-ui text-[10px] font-bold uppercase tracking-[.22em] text-gold/80">Si te atrapa la policía, nosotros no te conocemos.</p>
						</div>
					</div>
				</section>

				<section className="bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="rsvp">
					<div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
						<div className="reveal">
							<p className="eyebrow text-ink/55">Lista dorada</p>
							<h2 className="mt-5 font-display text-7xl leading-[.78] tracking-[-.06em] sm:text-9xl">¿Venís<br /><span className="text-gold-dark">al club?</span></h2>
							<p className="mt-8 max-w-sm font-serif text-2xl leading-tight text-ink/65">Confirmá tu presencia y dejá tu mensaje.</p>
							<div className="mt-10 flex items-center gap-3 font-ui text-xs font-bold uppercase tracking-[.18em] text-gold-dark"><Icon icon="lucide:users" width="17" /> {stats.confirmed} confirmados</div>
						</div>
						<form className="reveal pt-2" onSubmit={submitRsvp}>
							<label className="field-label">
								<span className="flex items-center justify-between gap-3">
									<span>Nombre completo</span>
									<span className="font-normal normal-case tracking-normal text-ink/35">{form.name.length}/{NAME_MAX}</span>
								</span>
								<input className="field-input" name="name" required maxLength={NAME_MAX} value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Tu nombre y apellido" />
							</label>
							<fieldset className="mt-8">
								<legend className="field-label">¿Te esperamos?</legend>
								<div className="mt-3 grid grid-cols-2 gap-3">
									{[[true, 'Sí, ahí estaré'], [false, 'No podré asistir']].map(([value, label]) => <button className={`inline-flex items-center gap-2 border px-4 py-2.5 text-left font-ui text-xs font-bold uppercase tracking-[.13em] transition ${form.attending === value ? 'border-gold-dark bg-gold-dark text-ivory' : 'border-ink/20 hover:border-gold-dark'}`} key={String(value)} type="button" onClick={() => updateForm('attending', value)} aria-pressed={form.attending === value}><Icon icon={value ? 'lucide:check' : 'lucide:minus'} width="15" />{label}</button>)}
								</div>
							</fieldset>
							<label className="field-label mt-8 block">
								<span className="flex items-center justify-between gap-3">
									<span>Dejá una línea para Elisa <span className="font-normal normal-case tracking-normal text-ink/35">(opcional)</span></span>
									<span className="font-normal normal-case tracking-normal text-ink/35">{form.message.length}/{MESSAGE_MAX}</span>
								</span>
								<textarea className="field-input min-h-28 resize-y" name="message" maxLength={MESSAGE_MAX} value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder="Un saludo, un recuerdo o una confesión..." />
							</label>
							<div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
								<button className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-ui text-xs font-bold uppercase tracking-[.2em] text-ivory transition hover:bg-gold-dark disabled:cursor-wait disabled:opacity-60" disabled={saving} type="submit">{saving ? 'Guardando...' : 'Anotar mi nombre'} <Icon className="transition-transform group-hover:translate-x-1" icon="lucide:arrow-up-right" width="16" /></button>
								<p className={`font-ui text-xs ${status.type === 'error' ? 'text-red-700' : status.type === 'success' ? 'text-emerald-700' : 'text-ink/45'}`} aria-live="polite">{status.message || 'Solo pedimos tu nombre para la lista.'}</p>
							</div>
						</form>
					</div>
				</section>

				<section className="relative overflow-hidden bg-ink px-6 py-20 text-center sm:px-12" id="lugar">
					<div className="deco-sunburst absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-20" aria-hidden="true" />
					<div className="relative mx-auto max-w-2xl">
						<p className="eyebrow justify-center">El punto de encuentro</p>
						<h2 className="mt-6 font-serif text-4xl text-ivory sm:text-6xl">Casa Quincho MC</h2>
						<p className="mt-4 font-ui text-sm text-ivory/60">Adolfo Calle 974 · Las Heras · Barrio Parque Norte</p>
						<a className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-2 font-ui text-xs font-bold uppercase tracking-[.22em] text-gold transition hover:text-ivory" href={MAP_LINK} target="_blank" rel="noreferrer">Abrir ubicación <Icon icon="lucide:map-pin" width="16" /></a>
					</div>
				</section>
			</main>

			<footer className="flex flex-col justify-between gap-3 bg-ink px-6 pb-8 font-ui text-[9px] font-bold uppercase tracking-[.24em] text-ivory/35 sm:flex-row sm:px-12">
				<span>Elisa · 102 años</span><span>Una noche para la historia</span><span>MC · 2026</span>
			</footer>

			<div className="pointer-events-none fixed inset-x-4 bottom-[4.75rem] z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-5 sm:right-5 lg:bottom-7 lg:right-7">
				{guestbookOpen && (
					<div className="guestbook-panel pointer-events-auto flex h-[min(28rem,calc(100vh-9rem))] w-full flex-col overflow-hidden border border-gold/40 bg-ink/95 text-ivory shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-md sm:ml-auto sm:h-[min(28rem,70vh)] sm:w-[min(22rem,calc(100vw-2.5rem))]" id="guestbook-panel" role="dialog" aria-label="Lista dorada y saludos">
						<div className="flex items-start justify-between gap-3 border-b border-ivory/10 px-4 py-3">
							<div>
								<p className="font-ui text-[9px] font-bold uppercase tracking-[.28em] text-gold">Lista dorada</p>
								<p className="mt-1 font-serif text-xl text-ivory">{stats.confirmed} confirmados</p>
							</div>
							<div className="flex items-center gap-2">
								<button className="border border-ivory/20 p-2 text-ivory/70 transition hover:border-gold hover:text-gold" type="button" onClick={() => openGuestbookModal()} aria-label="Expandir lista dorada">
									<Icon icon="lucide:expand" width="14" />
								</button>
								<button className="border border-ivory/20 p-2 text-ivory/70 transition hover:border-gold hover:text-gold" type="button" onClick={() => setGuestbookOpen(false)} aria-label="Cerrar lista">
									<Icon icon="lucide:x" width="14" />
								</button>
							</div>
						</div>

						<div className="flex items-center gap-2 border-b border-ivory/10 px-3 py-2.5">
							<button
								className="inline-flex min-w-0 flex-1 items-center justify-between gap-2 border border-gold/40 bg-gold/10 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.16em] text-gold transition hover:bg-gold/20"
								type="button"
								onClick={() => setGuestbookFilter((current) => current === 'all' ? 'confirmed' : current === 'confirmed' ? 'declined' : 'all')}
								aria-label={`Filtro actual: ${guestbookFilter === 'all' ? 'Todos' : guestbookFilter === 'confirmed' ? 'Confirmados' : 'No asisten'}. Cambiar filtro`}
							>
								<span className="truncate">
									{guestbookFilter === 'all' ? 'Todos' : guestbookFilter === 'confirmed' ? 'Confirmados' : 'No asisten'}
								</span>
								<Icon className="shrink-0 opacity-70" icon="lucide:refresh-cw" width="11" />
							</button>
							<button
								className="inline-flex shrink-0 items-center gap-1.5 border border-ivory/20 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.16em] text-ivory/70 transition hover:border-gold/50 hover:text-gold"
								type="button"
								onClick={() => setGuestbookSort((current) => current === 'newest' ? 'oldest' : 'newest')}
								aria-label={`Orden actual: ${guestbookSort === 'newest' ? 'Recientes' : 'Antiguos'}. Cambiar orden`}
							>
								<Icon icon={guestbookSort === 'newest' ? 'lucide:arrow-down-wide-narrow' : 'lucide:arrow-up-narrow-wide'} width="11" />
								{guestbookSort === 'newest' ? 'Recientes' : 'Antiguos'}
							</button>
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
							{visibleGuests.length === 0 ? (
								<p className="px-3 py-8 text-center font-serif text-lg text-ivory/50">
									{guests.length === 0 ? 'Todavía no hay saludos para Elisa.' : 'Nadie en este filtro por ahora.'}
								</p>
							) : (
								<ul className="space-y-1">
									{visibleGuests.map((guest) => {
										const active = guest.id === activeGuestId;
										const attending = Boolean(guest.attending);
										return (
											<li key={guest.id}>
												<button
													className={`w-full border px-3 py-3 text-left transition ${active ? 'border-gold/50 bg-gold/10' : 'border-transparent hover:border-ivory/15 hover:bg-ivory/5'}`}
													type="button"
													data-guest-id={guest.id}
													onClick={() => openGuestbookModal(guest.id)}
													aria-pressed={active}
												>
													<div className="flex items-center justify-between gap-2">
														<span className="flex min-w-0 items-center gap-2">
															<span
																className={`size-2 shrink-0 rounded-full ${attending ? 'bg-emerald-400' : 'bg-rose-400'}`}
																aria-label={attending ? 'Confirmó asistencia' : 'No podrá asistir'}
																title={attending ? 'Confirmó asistencia' : 'No podrá asistir'}
															/>
															<span className="truncate font-ui text-[10px] font-bold uppercase tracking-[.18em] text-gold">{guest.name}</span>
														</span>
														{guest.message ? <Icon className="shrink-0 text-ivory/35" icon="lucide:message-circle" width="12" /> : null}
													</div>
													{guest.message ? (
														<p className={`mt-2 font-serif text-base leading-snug text-ivory/75 transition ${active ? 'line-clamp-none' : 'line-clamp-2'}`}>
															“{guest.message}”
														</p>
													) : (
														<p className="mt-2 font-ui text-[10px] uppercase tracking-[.16em] text-ivory/30">Confirmó presencia</p>
													)}
												</button>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					</div>
				)}

				<div className="pointer-events-auto hidden flex-col items-end gap-2 lg:flex">
					<button
						className="guestbook-fab flex items-center gap-2 border border-gold/70 bg-ink/90 px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ivory shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-ink"
						type="button"
						onClick={() => setLocationModalOpen(true)}
						aria-label="Ver ubicación"
					>
						<Icon icon="lucide:map-pin" width="14" />
						<span>Ubicación</span>
					</button>
					<button
						className="guestbook-fab relative flex items-center gap-2 border border-gold/70 bg-gold px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ink shadow-[0_10px_30px_rgba(197,154,74,.35)] transition hover:bg-ivory"
						type="button"
						onClick={() => {
							if (guestbookOpen) {
								setGuestbookOpen(false);
								return;
							}
							setGuestbookOpen(true);
							void loadGuestbook();
						}}
						aria-expanded={guestbookOpen}
						aria-controls="guestbook-panel"
						aria-label={guestbookOpen ? 'Cerrar lista dorada' : 'Abrir lista dorada'}
					>
						<Icon icon={guestbookOpen ? 'lucide:x' : 'lucide:book-heart'} width="14" />
						<span>{guestbookOpen ? 'Cerrar' : 'Saludos'}</span>
						{!guestbookOpen && guests.length > 0 && (
							<span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center bg-ink px-1.5 py-0.5 font-ui text-[9px] font-bold text-gold">
								{guests.length}
							</span>
						)}
					</button>
				</div>
			</div>

			<MobileTabBar
				musicPlaying={musicPlaying}
				guestbookOpen={guestbookOpen}
				guestCount={guests.length}
				onToggleMusic={toggleMusic}
				onOpenLocation={() => setLocationModalOpen(true)}
				onOpenRsvp={() => {
					setStatus({ type: 'idle', message: '' });
					setRsvpModalOpen(true);
				}}
				onToggleGuestbook={() => {
					if (guestbookOpen) {
						setGuestbookOpen(false);
						return;
					}
					setGuestbookOpen(true);
					void loadGuestbook();
				}}
			/>

			{locationModalOpen && (
				<div className="fixed inset-0 z-[65] flex items-center justify-center p-4 sm:p-6" role="presentation">
					<button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" type="button" aria-label="Cerrar ubicación" onClick={() => setLocationModalOpen(false)} />
					<div
						className="guestbook-modal relative w-[min(36rem,100%)] overflow-hidden border border-gold/40 bg-ink text-ivory shadow-[0_24px_60px_rgba(0,0,0,.5)]"
						role="dialog"
						aria-modal="true"
						aria-label="Punto de encuentro"
					>
						<button
							className="absolute right-3 top-3 z-10 border border-ivory/20 bg-ink/80 p-2 text-ivory/70 transition hover:border-gold hover:text-gold"
							type="button"
							onClick={() => setLocationModalOpen(false)}
							aria-label="Cerrar ubicación"
						>
							<Icon icon="lucide:x" width="14" />
						</button>
						<div className="border-b border-ivory/10 px-5 py-5 pr-14">
							<p className="font-ui text-[9px] font-bold uppercase tracking-[.28em] text-gold">El punto de encuentro</p>
							<h2 className="mt-3 font-serif text-3xl text-ivory sm:text-4xl">Casa Quincho MC</h2>
							<p className="mt-2 font-ui text-xs leading-5 text-ivory/60">Adolfo Calle 974 · Las Heras · Barrio Parque Norte</p>
						</div>
						<div className="aspect-[4/3] w-full bg-[#181b19]">
							<iframe
								className="h-full w-full border-0 grayscale-[.15]"
								src={MAP_EMBED_SRC}
								title="Mapa de Casa Quincho MC"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								allowFullScreen
							/>
						</div>
						<div className="px-5 py-4">
							<a
								className="inline-flex items-center gap-2 border-b border-gold pb-1.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-gold transition hover:text-ivory"
								href={MAP_LINK}
								target="_blank"
								rel="noreferrer"
							>
								Abrir en Google Maps <Icon icon="lucide:map-pin" width="14" />
							</a>
						</div>
					</div>
				</div>
			)}

			{guestbookModalOpen && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="presentation">
					<button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" type="button" aria-label="Cerrar modal" onClick={() => setGuestbookModalOpen(false)} />
					<div
						className="guestbook-modal relative flex max-h-[min(90vh,54rem)] w-[min(72rem,100%)] flex-col overflow-hidden border border-gold/40 bg-ink text-ivory shadow-[0_30px_80px_rgba(0,0,0,.55)]"
						role="dialog"
						aria-modal="true"
						aria-label="Lista dorada ampliada"
					>
						<button
							className="absolute right-4 top-4 z-10 border border-ivory/20 bg-ink/80 p-2.5 text-ivory/70 transition hover:border-gold hover:text-gold sm:right-6 sm:top-6"
							type="button"
							onClick={() => setGuestbookModalOpen(false)}
							aria-label="Cerrar modal"
						>
							<Icon icon="lucide:x" width="16" />
						</button>

						<div className="border-b border-ivory/10 px-5 py-5 pr-16 sm:px-8 sm:pr-20">
							<p className="font-ui text-[10px] font-bold uppercase tracking-[.28em] text-gold">Lista dorada</p>
							<h2 className="mt-2 font-display text-5xl leading-[.88] tracking-[-.05em] sm:text-7xl">Saludos<br /><span className="text-gold">para Elisa.</span></h2>
							<p className="mt-3 font-ui text-[10px] uppercase tracking-[.2em] text-ivory/45">{stats.confirmed} confirmados · {visibleGuests.length} en vista</p>

							<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
								<div className="flex flex-wrap items-end gap-3">
									<label className="block min-w-[10rem]">
										<span className="mb-1.5 block font-ui text-[8px] font-bold uppercase tracking-[.2em] text-ivory/40">Filtrar</span>
										<select
											className="guestbook-select w-full"
											value={guestbookFilter}
											onChange={(event) => setGuestbookFilter(event.target.value as GuestbookFilter)}
										>
											<option value="all">Todos</option>
											<option value="confirmed">Confirmados</option>
											<option value="declined">No asisten</option>
										</select>
									</label>
									<label className="block min-w-[10rem]">
										<span className="mb-1.5 block font-ui text-[8px] font-bold uppercase tracking-[.2em] text-ivory/40">Orden</span>
										<select
											className="guestbook-select w-full"
											value={guestbookSort}
											onChange={(event) => setGuestbookSort(event.target.value as GuestbookSort)}
										>
											<option value="newest">Recientes</option>
											<option value="oldest">Antiguos</option>
										</select>
									</label>
									<button
										className="inline-flex items-center gap-2 border border-gold bg-gold px-4 py-2.5 font-ui text-[9px] font-bold uppercase tracking-[.18em] text-ink transition hover:bg-ivory"
										type="button"
										onClick={() => {
											setStatus({ type: 'idle', message: '' });
											setRsvpModalOpen(true);
										}}
									>
										<Icon icon="lucide:pen-line" width="13" />
										Dejar mi saludo
									</button>
								</div>
								<p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ui text-[9px] uppercase tracking-[.16em] text-ivory/45">
									<span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" /> Asiste</span>
									<span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-rose-400" aria-hidden="true" /> No asiste</span>
								</p>
							</div>
						</div>

						<div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.1fr_.9fr]">
							<div className="min-h-0 overflow-y-auto overscroll-contain border-b border-ivory/10 p-3 sm:p-4 lg:border-b-0 lg:border-r">
								{visibleGuests.length === 0 ? (
									<p className="px-4 py-16 text-center font-serif text-2xl text-ivory/50">
										{guests.length === 0 ? 'Todavía no hay saludos para Elisa.' : 'Nadie en este filtro por ahora.'}
									</p>
								) : (
									<ul className="space-y-2">
										{visibleGuests.map((guest) => {
											const active = guest.id === activeGuestId;
											const attending = Boolean(guest.attending);
											return (
												<li key={guest.id}>
													<button
														className={`w-full border px-4 py-3.5 text-left transition ${active ? 'border-gold/60 bg-gold/10' : 'border-ivory/10 hover:border-ivory/25 hover:bg-ivory/5'}`}
														type="button"
														onClick={() => setActiveGuestId(guest.id)}
														aria-pressed={active}
													>
														<div className="flex items-center gap-3">
															<span className={`size-2.5 shrink-0 rounded-full ${attending ? 'bg-emerald-400' : 'bg-rose-400'}`} aria-hidden="true" />
															<span className="font-ui text-xs font-bold uppercase tracking-[.2em] text-gold">{guest.name}</span>
														</div>
													</button>
												</li>
											);
										})}
									</ul>
								)}
							</div>

							<div className="flex min-h-0 flex-col justify-between gap-8 overflow-y-auto overscroll-contain bg-ivory/[0.03] p-6 sm:p-8">
								{(() => {
									const featured = visibleGuests.find((guest) => guest.id === activeGuestId) ?? visibleGuests[0];
									if (!featured) {
										return <p className="font-serif text-2xl text-ivory/45">Elegí un saludo de la lista.</p>;
									}
									const attending = Boolean(featured.attending);
									return (
										<>
											<div>
												<h3 className="font-display text-4xl tracking-[-.04em] text-ivory sm:text-5xl">{featured.name}</h3>
												<p className="mt-3 font-ui text-[10px] uppercase tracking-[.2em] text-ivory/40">
													{attending ? 'Confirmó asistencia' : 'No podrá asistir'}
												</p>
												{featured.message ? (
													<blockquote className="mt-8 border-l border-gold/50 pl-5 font-serif text-2xl leading-[1.35] text-ivory/85 sm:text-3xl">
														“{featured.message}”
													</blockquote>
												) : (
													<p className="mt-8 font-serif text-2xl text-ivory/50">Sin mensaje, pero presente en la lista.</p>
												)}
											</div>
											<p className="font-ui text-[9px] uppercase tracking-[.22em] text-ivory/30">
												{new Date(featured.createdAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
											</p>
										</>
									);
								})()}
							</div>
						</div>
					</div>
				</div>
			)}

			{rsvpModalOpen && (
				<div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8" role="presentation">
					<button className="absolute inset-0 bg-ink/85 backdrop-blur-sm" type="button" aria-label="Cerrar formulario" onClick={() => setRsvpModalOpen(false)} />
					<div
						className="guestbook-modal relative max-h-[min(92vh,44rem)] w-[min(36rem,100%)] overflow-y-auto overscroll-contain border border-gold-dark/30 bg-paper px-5 py-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,.55)] sm:px-8 sm:py-8"
						role="dialog"
						aria-modal="true"
						aria-label="Confirmar presencia"
					>
						<button
							className="absolute right-4 top-4 border border-ink/15 p-2 text-ink/55 transition hover:border-gold-dark hover:text-gold-dark"
							type="button"
							onClick={() => setRsvpModalOpen(false)}
							aria-label="Cerrar formulario"
						>
							<Icon icon="lucide:x" width="16" />
						</button>
						<p className="eyebrow text-ink/55">Acceso rápido</p>
						<h2 className="mt-3 max-w-sm font-display text-5xl leading-[.88] tracking-[-.05em] sm:text-6xl">¿Venís<br /><span className="text-gold-dark">al club?</span></h2>
						<p className="mt-4 max-w-sm font-serif text-xl leading-tight text-ink/65">Confirmá tu presencia y dejá tu mensaje.</p>
						<form className="mt-8 pt-2" onSubmit={submitRsvp}>
							<label className="field-label">
								<span className="flex items-center justify-between gap-3">
									<span>Nombre completo</span>
									<span className="font-normal normal-case tracking-normal text-ink/35">{form.name.length}/{NAME_MAX}</span>
								</span>
								<input className="field-input" name="name" required maxLength={NAME_MAX} value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="Tu nombre y apellido" />
							</label>
							<fieldset className="mt-8">
								<legend className="field-label">¿Te esperamos?</legend>
								<div className="mt-3 grid grid-cols-2 gap-3">
									{[[true, 'Sí, ahí estaré'], [false, 'No podré asistir']].map(([value, label]) => (
										<button
											className={`inline-flex items-center gap-2 border px-4 py-2.5 text-left font-ui text-xs font-bold uppercase tracking-[.13em] transition ${form.attending === value ? 'border-gold-dark bg-gold-dark text-ivory' : 'border-ink/20 hover:border-gold-dark'}`}
											key={String(value)}
											type="button"
											onClick={() => updateForm('attending', value)}
											aria-pressed={form.attending === value}
										>
											<Icon icon={value ? 'lucide:check' : 'lucide:minus'} width="15" />
											{label}
										</button>
									))}
								</div>
							</fieldset>
							<label className="field-label mt-8 block">
								<span className="flex items-center justify-between gap-3">
									<span>Dejá una línea para Elisa <span className="font-normal normal-case tracking-normal text-ink/35">(opcional)</span></span>
									<span className="font-normal normal-case tracking-normal text-ink/35">{form.message.length}/{MESSAGE_MAX}</span>
								</span>
								<textarea className="field-input min-h-28 resize-y" name="message" maxLength={MESSAGE_MAX} value={form.message} onChange={(event) => updateForm('message', event.target.value)} placeholder="Un saludo, un recuerdo o una confesión..." />
							</label>
							<div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
								<button className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-ui text-xs font-bold uppercase tracking-[.2em] text-ivory transition hover:bg-gold-dark disabled:cursor-wait disabled:opacity-60" disabled={saving} type="submit">
									{saving ? 'Guardando...' : 'Anotar mi nombre'}
									<Icon className="transition-transform group-hover:translate-x-1" icon="lucide:arrow-up-right" width="16" />
								</button>
								<p className={`font-ui text-xs ${status.type === 'error' ? 'text-red-700' : status.type === 'success' ? 'text-emerald-700' : 'text-ink/45'}`} aria-live="polite">
									{status.message || 'Solo pedimos tu nombre para la lista.'}
								</p>
							</div>
						</form>
					</div>
				</div>
			)}

			{attireLightbox && (
				<div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-8" role="presentation">
					<button className="absolute inset-0 cursor-zoom-out" type="button" aria-label="Cerrar imagen" onClick={() => setAttireLightbox(null)} />
					<div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center" role="dialog" aria-modal="true" aria-label={attireLightbox.alt}>
						<button
							className="absolute -top-1 right-0 z-20 border border-ivory/25 bg-ink/70 p-2.5 text-ivory/80 transition hover:border-gold hover:text-gold sm:-right-2 sm:-top-2"
							type="button"
							onClick={() => setAttireLightbox(null)}
							aria-label="Cerrar imagen"
						>
							<Icon icon="lucide:x" width="18" />
						</button>
						<img
							className="max-h-[min(85vh,56rem)] w-auto max-w-full object-contain shadow-[0_30px_80px_rgba(0,0,0,.55)]"
							src={attireLightbox.src}
							alt={attireLightbox.alt}
						/>
						<p className="mt-4 flex items-center gap-3 font-ui text-[10px] font-bold uppercase tracking-[.28em] text-ivory/70">
							<span>{attireLightbox.label}</span>
							<span className="text-gold">{attireLightbox.detail}</span>
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
