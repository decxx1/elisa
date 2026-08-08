import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import AlbumLightbox from '@/components/overlays/AlbumLightbox';
import { albumPhotos } from '@/lib/album';

const tileLayouts = [
	'col-span-2 row-span-2',
	'col-span-2 row-span-2',
	'',
	'',
	'row-span-2',
	'',
	'row-span-2',
	'',
	'row-span-2',
	'',
	'',
	'',
	'col-span-2',
	'col-span-2 row-span-2',
	'',
	'row-span-2'
];

export default function GaleriaSection() {
	const [active, setActive] = useState(0);
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
	const total = albumPhotos.length;

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

	return (
		<section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="galeria">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-dark/40 to-transparent" aria-hidden="true" />
			<div className="deco-sunburst absolute -right-24 top-16 size-[28rem] opacity-15" aria-hidden="true" />

			<div className="relative mx-auto max-w-7xl">
				<div className="reveal flex flex-col justify-between gap-8 border-b border-ink/15 pb-10 lg:flex-row lg:items-end">
					<div className="max-w-2xl">
						<p className="eyebrow text-ink/55">Memorias</p>
						<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">
							Memorias
							<br />
							<span className="text-gold-dark">doradas.</span>
						</h2>
					</div>
					<p className="font-ui text-[10px] font-bold uppercase tracking-[.24em] text-ink/45 lg:text-right">{total} fotos</p>
				</div>

				<div className="reveal relative mt-14">
					<div className="relative mx-auto max-w-6xl">
						<div className="deco-frame pointer-events-none absolute -inset-3 border border-gold-dark/40 sm:-inset-5" aria-hidden="true" />
						<div className="bg-[#181b19] p-2 sm:p-3">
							<div className="grid auto-rows-[7rem] grid-flow-dense grid-cols-2 gap-2 sm:auto-rows-[8rem] sm:grid-cols-3 sm:gap-3 lg:auto-rows-[9rem] lg:grid-cols-4">
								{albumPhotos.map((photo, index) => (
									<button
										key={photo.id}
										type="button"
										className={`group relative min-h-0 overflow-hidden border border-gold-dark/60 bg-[#181b19] p-1 text-left transition-colors hover:border-gold ${tileLayouts[index] ?? ''} ${
											index === active ? 'ring-2 ring-inset ring-gold' : ''
										}`}
										onClick={() => {
											setActive(index);
											setLightboxIndex(index);
										}}
										aria-label={`Ampliar ${photo.alt}`}
										aria-current={index === active}
									>
										<img
											className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
											src={photo.thumb}
											alt={photo.alt}
											loading={index < 6 ? 'eager' : 'lazy'}
											draggable={false}
										/>
										<div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,6,5,.55)_100%)] opacity-70 transition group-hover:opacity-100" />
										<span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 font-ui text-[9px] font-bold uppercase tracking-[.2em] text-ivory/85 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
											<Icon icon="lucide:expand" width="12" /> Ver
										</span>
									</button>
								))}
						</div>
					</div>
				</div>
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
