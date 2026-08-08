import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';

type SiteHeaderProps = {
	musicPlaying: boolean;
	onToggleMusic: () => void;
};

export const navLinks = [
	{ href: '#historia', label: 'La historia' },
	{ href: '#vestimenta', label: 'Vestimenta' },
	{ href: '#programa', label: 'El programa' },
	{ href: '#rsvp', label: 'Confirmar' }
] as const;

export default function SiteHeader({ musicPlaying, onToggleMusic }: SiteHeaderProps) {
	const [scrolled, setScrolled] = useState(false);
	const [navOpen, setNavOpen] = useState(false);

	useEffect(() => {
		function onScroll() {
			setScrolled(window.scrollY > 24);
		}
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		if (!navOpen) return;
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') setNavOpen(false);
		}
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = previous;
			window.removeEventListener('keydown', onKey);
		};
	}, [navOpen]);

	return (
		<>
			<header
				className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ${
					scrolled || navOpen
						? 'border-b border-ivory/10 bg-ink/75 shadow-[0_10px_40px_rgba(0,0,0,.35)] backdrop-blur-xl'
						: 'border-b border-transparent bg-transparent mix-blend-difference'
				}`}
			>
				<div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-9 sm:py-5">
					<a
						className="shrink-0 font-display text-xl tracking-[0.2em] text-white sm:text-2xl"
						href="#inicio"
						aria-label="Volver al inicio"
						onClick={() => setNavOpen(false)}
					>
						Elisa
					</a>
					<nav
						className="hidden min-w-0 items-center gap-5 font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-white lg:flex lg:gap-6"
						aria-label="Navegación principal"
					>
						{navLinks.map((link) => (
							<a className="whitespace-nowrap transition-opacity hover:opacity-60" href={link.href} key={link.href}>
								{link.label}
							</a>
						))}
					</nav>
					<button
						className="hidden shrink-0 items-center gap-2 rounded-full border border-gold bg-gold px-3 py-2 font-ui text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-ivory lg:flex"
						type="button"
						onClick={onToggleMusic}
						aria-label={musicPlaying ? 'Pausar jazz' : 'Encender jazz'}
						aria-pressed={musicPlaying}
					>
						<Icon className="music-pulse text-ink" icon={musicPlaying ? 'lucide:volume-2' : 'lucide:music-2'} width="14" />
						<span>{musicPlaying ? 'Pausar jazz' : 'Encender jazz'}</span>
					</button>
					<div className="flex items-center gap-2 lg:hidden">
						<button
							className="flex size-10 shrink-0 items-center justify-center border border-gold bg-gold text-ink transition hover:bg-ivory"
							type="button"
							onClick={onToggleMusic}
							aria-label={musicPlaying ? 'Pausar jazz' : 'Encender jazz'}
							aria-pressed={musicPlaying}
						>
							<Icon className="music-pulse text-ink" icon={musicPlaying ? 'lucide:volume-2' : 'lucide:music-2'} width="17" />
						</button>
						<button
							className="flex size-10 shrink-0 items-center justify-center border border-white/30 text-white transition hover:bg-white hover:text-ink"
							type="button"
							onClick={() => setNavOpen((open) => !open)}
							aria-expanded={navOpen}
							aria-controls="mobile-nav"
							aria-label={navOpen ? 'Cerrar menú' : 'Abrir menú'}
						>
							<Icon icon={navOpen ? 'lucide:x' : 'lucide:menu'} width="18" />
						</button>
					</div>
				</div>
			</header>

			{navOpen && (
				<div className="fixed inset-0 z-[45] lg:hidden" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Navegación">
					<button className="absolute inset-0 bg-ink/70 backdrop-blur-sm" type="button" aria-label="Cerrar menú" onClick={() => setNavOpen(false)} />
					<nav className="absolute inset-x-0 top-[4.25rem] mx-4 border border-ivory/15 bg-ink/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,.45)] backdrop-blur-xl sm:mx-9">
						<p className="font-ui text-[9px] font-bold uppercase tracking-[.28em] text-gold">Navegación</p>
						<ul className="mt-5 space-y-1">
							{navLinks.map((link) => (
								<li key={link.href}>
									<a
										className="block border-b border-ivory/10 py-3.5 font-ui text-xs font-bold uppercase tracking-[.22em] text-ivory transition hover:text-gold"
										href={link.href}
										onClick={() => setNavOpen(false)}
									>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</div>
			)}
		</>
	);
}
