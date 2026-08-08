import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import AttireLightbox from '@/components/overlays/AttireLightbox';
import { attireLooks, type AttireLightbox as AttireLook } from '@/lib/guestbook';

export default function VestimentaSection() {
	const [lightbox, setLightbox] = useState<AttireLook | null>(null);

	useEffect(() => {
		if (!lightbox) return;
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') setLightbox(null);
		}
		window.addEventListener('keydown', onKey);
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = previous;
		};
	}, [lightbox]);

	return (
		<section className="relative overflow-hidden bg-ink px-6 py-24 text-ivory sm:px-12 lg:px-20" id="vestimenta">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden="true" />
			<div className="relative mx-auto max-w-7xl">
				<div className="reveal flex flex-col justify-between gap-8 border-b border-ivory/15 pb-10 lg:flex-row lg:items-end">
					<div className="max-w-2xl">
						<p className="eyebrow">Código de vestimenta</p>
						<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">
							Lucí tu
							<br />
							<span className="text-gold">mejor época.</span>
						</h2>
					</div>
					<p className="hidden max-w-xs font-ui text-[10px] font-bold uppercase tracking-[.24em] text-ivory/45 lg:inline lg:text-right">
						Inspiración · Años 20
						<br />
						<span className="text-ivory">Ella &amp; Él</span>
					</p>
				</div>

				<div className="mt-12 flex flex-col">
					<div className="reveal order-1 grid gap-10 border-b border-ivory/15 pb-12 lg:order-2 lg:mt-16 lg:grid-cols-[1fr_.9fr] lg:gap-20 lg:border-b-0 lg:border-t lg:pb-0 lg:pt-12">
						<div className="space-y-6 font-serif text-2xl leading-[1.3] text-ivory/75 sm:text-3xl">
							<p className="text-ivory">Te invitamos a lucir tu mejor atuendo de la época.</p>
							<p>
								¿No tenés disfraz? <span className="text-gold">¡Cero drama!</span> Te esperamos con un rincón lleno de sombreros, plumas, collares y
								moños para que te lookees al llegar.
							</p>
						</div>
						<div className="flex flex-col justify-between gap-8 lg:border-l lg:border-ivory/15 lg:pl-12">
							<div className="flex flex-wrap gap-x-6 gap-y-3 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ivory/50">
								<span className="flex items-center gap-2">
									<Icon className="text-gold" icon="lucide:hat-glasses" width="16" /> Sombreros
								</span>
								<span className="flex items-center gap-2">
									<Icon className="text-gold" icon="lucide:feather" width="16" /> Plumas
								</span>
								<span className="flex items-center gap-2">
									<Icon className="text-gold" icon="lucide:gem" width="16" /> Collares
								</span>
								<span className="flex items-center gap-2">
									<Icon className="text-gold" icon="lucide:ribbon" width="16" /> Moños
								</span>
							</div>
							<p className="font-display text-4xl leading-[.9] tracking-[-.04em] text-ivory sm:text-5xl">¡Lo importante es tu presencia!</p>
						</div>
					</div>

					<div className="order-2 mt-14 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:order-1 lg:mt-14">
						{attireLooks.map((look) => (
							<figure className="reveal group relative" key={look.src}>
								<div className="deco-frame absolute -inset-4 border border-gold/35 sm:-inset-5" aria-hidden="true" />
								<button
									className="relative aspect-[3/4] w-full overflow-hidden bg-[#181b19] text-left"
									type="button"
									onClick={() => setLightbox(look)}
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
			</div>

			{lightbox && <AttireLightbox look={lightbox} onClose={() => setLightbox(null)} />}
		</section>
	);
}
