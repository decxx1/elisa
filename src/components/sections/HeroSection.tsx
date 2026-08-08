import { Icon } from '@iconify/react';

export default function HeroSection() {
	return (
		<section
			className="hero-section relative isolate flex min-h-[100svh] items-center overflow-hidden px-6 pb-28 pt-28 sm:px-12 lg:min-h-[min(900px,100svh)] lg:items-end lg:px-20 lg:pb-20 lg:pt-32"
			id="inicio"
		>
			<img
				className="hero-art absolute inset-0 -z-20 h-[115%] w-full object-cover object-center"
				src="/images/art-deco-jazz-club.webp"
				alt="Salón de jazz Art Déco con piano y micrófono antiguo"
			/>
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,5,5,.40)_0%,rgba(3,5,5,.34)_40%,rgba(3,5,5,.18)_100%)]" />
			<div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#050605_0%,transparent_46%,rgba(3,5,5,.2)_100%)]" />

			<div className="relative z-10 mx-auto w-full max-w-7xl">
				<div className="hero-copy mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
					<p className="mb-6 flex items-center justify-center gap-3 font-ui text-[11px] font-bold uppercase tracking-[0.42em] text-gold lg:justify-start">
						<span className="h-px w-10 shrink-0 bg-gold" />{' '}
						<span>
							Invitación privada · <span className="whitespace-nowrap">1924 / 2026</span>
						</span>
					</p>
					<h1 className="font-display text-[clamp(6.75rem,20vw,14rem)] leading-[.72] tracking-[-.08em] text-ivory">
						Elisa<span className="text-gold">.</span>
					</h1>
					<p className="mx-auto mt-8 max-w-xl font-serif text-3xl leading-tight text-ivory/85 sm:text-4xl lg:mx-0">
						¡Adentrémonos en los dorados años 20!
					</p>
					<p className="mt-5 font-ui text-[11px] font-bold uppercase tracking-[0.28em] text-gold">Miércoles 19 de agosto</p>
					<div className="mt-10 hidden flex-wrap items-center gap-3 font-ui text-xs font-bold uppercase tracking-[0.2em] lg:flex">
						<a className="group inline-flex items-center gap-3 bg-gold px-5 py-4 text-ink transition hover:bg-ivory" href="#rsvp">
							Reservar mi lugar <Icon className="transition-transform group-hover:translate-x-1" icon="lucide:arrow-up-right" width="16" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
