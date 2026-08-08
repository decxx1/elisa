import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import AlbumLightbox from '@/components/overlays/AlbumLightbox';
import { albumPhotos } from '@/lib/album';

const AUTO_MS = 4200;

export default function GaleriaSection() {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const total = albumPhotos.length;

	useEffect(() => {
		if (paused || lightboxIndex != null) return;
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduce) return;
		const timer = window.setInterval(() => {
			setActive((current) => (current + 1) % total);
		}, AUTO_MS);
		return () => window.clearInterval(timer);
	}, [paused, lightboxIndex, total]);

	useEffect(() => {
		const next = albumPhotos[(active + 1) % total];
		if (!next) return;
		const img = new Image();
		img.src = next.src;
	}, [active, total]);

	useEffect(() => {
		if (lightboxIndex == null) return;
		function onKey(event: KeyboardEvent) {
			if (event.key === 'Escape') setLightboxIndex(null);
			else if (event.key === 'ArrowLeft') setLightboxIndex((i) => (i == null ? i : (i - 1 + total) % total));
			else if (event.key === 'ArrowRight') setLightboxIndex((i) => (i == null ? i : (i + 1) % total));
		}
		window.addEventListener('keydown', onKey);
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('keydown', onKey);
			document.body.style.overflow = previous;
		};
	}, [lightboxIndex, total]);

	function go(delta: number) {
		setActive((current) => (current + delta + total) % total);
	}

	return (
		<section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="galeria">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dark/40 to-transparent" aria-hidden="true" />
			<div className="deco-sunburst absolute -right-24 top-16 size-[28rem] opacity-15" aria-hidden="true" />

			<div className="relative mx-auto max-w-7xl">
				<div className="reveal flex flex-col justify-between gap-8 border-b border-ink/15 pb-10 lg:flex-row lg:items-end">
					<div className="max-w-2xl">
						<p className="eyebrow text-ink/55">Memorias</p>
						<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">
							El álbum
							<br />
							<span className="text-gold-dark">dorado.</span>
						</h2>
					</div>
					<p className="max-w-xs font-ui text-[10px] font-bold uppercase tracking-[.24em] text-ink/45 lg:text-right">
						Tocá para ampliar
						<br />
						<span className="text-ink">
							{String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
						</span>
					</p>
				</div>

				<div
					className="reveal relative mt-14"
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}
					onFocusCapture={() => setPaused(true)}
					onBlurCapture={(event) => {
						if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
					}}
				>
					<div className="relative mx-auto max-w-4xl">
						<div className="deco-frame absolute -inset-3 border border-gold-dark/40 sm:-inset-5" aria-hidden="true" />

						<div className="relative overflow-hidden bg-[#181b19]">
							<div
								className="flex transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
								style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}
							>
								{albumPhotos.map((photo, index) => (
									<button
										key={photo.id}
										type="button"
										className="group relative aspect-[4/3] w-full shrink-0 overflow-hidden text-left"
										onClick={() => setLightboxIndex(index)}
										aria-label={`Ampliar ${photo.alt}`}
										aria-current={index === active}
									>
										<img
											className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
											src={photo.thumb}
											alt={photo.alt}
											loading={index === 0 ? 'eager' : 'lazy'}
											draggable={false}
										/>
										<div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(5,6,5,.45)_100%)]" />
										<span className="absolute right-4 top-4 inline-flex items-center gap-1.5 border border-ivory/25 bg-ink/50 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.2em] text-ivory/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100 group-focus-visible:opacity-100">
											<Icon icon="lucide:expand" width="12" /> Ver
										</span>
									</button>
								))}
							</div>
						</div>
					</div>

					<div className="mt-8 flex items-center justify-between gap-3 sm:gap-4">
						<button
							className="inline-flex items-center gap-2 border border-ink/20 px-3 py-3 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ink transition hover:border-gold-dark hover:text-gold-dark sm:px-4"
							type="button"
							onClick={() => go(-1)}
							aria-label="Foto anterior"
						>
							<Icon icon="lucide:arrow-left" width="14" />
							<span className="hidden sm:inline">Anterior</span>
						</button>

						<div className="flex flex-wrap items-center justify-center gap-2" role="tablist" aria-label="Fotos del álbum">
							{albumPhotos.map((photo, index) => (
								<button
									key={photo.id}
									type="button"
									role="tab"
									aria-selected={index === active}
									aria-label={`Ir a foto ${index + 1}`}
									className={`h-1.5 transition-all ${index === active ? 'w-8 bg-gold-dark' : 'w-1.5 bg-ink/25 hover:bg-ink/45'}`}
									onClick={() => setActive(index)}
								/>
							))}
						</div>

						<button
							className="inline-flex items-center gap-2 border border-ink/20 px-3 py-3 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ink transition hover:border-gold-dark hover:text-gold-dark sm:px-4"
							type="button"
							onClick={() => go(1)}
							aria-label="Foto siguiente"
						>
							<span className="hidden sm:inline">Siguiente</span>
							<Icon icon="lucide:arrow-right" width="14" />
						</button>
					</div>

					<ul className="mt-10 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{albumPhotos.map((photo, index) => (
							<li key={`thumb-${photo.id}`} className="w-[4.5rem] shrink-0 sm:w-[5.5rem]">
								<button
									type="button"
									className={`relative aspect-[4/3] w-full overflow-hidden border transition ${
										index === active ? 'border-gold-dark ring-1 ring-gold-dark/40' : 'border-ink/10 opacity-55 hover:opacity-90'
									}`}
									onClick={() => setActive(index)}
									aria-label={`Mostrar foto ${index + 1}`}
									aria-current={index === active}
								>
									<img className="h-full w-full object-cover" src={photo.thumb} alt="" loading="lazy" draggable={false} />
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>

			{lightboxIndex != null && (
				<AlbumLightbox
					photos={albumPhotos}
					index={lightboxIndex}
					onClose={() => setLightboxIndex(null)}
					onChange={setLightboxIndex}
				/>
			)}
		</section>
	);
}
