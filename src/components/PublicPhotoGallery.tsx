import { Icon } from '@iconify/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export type PublicPhoto = {
	id: number;
	uploaderName: string;
	originalName: string;
	storedName: string;
	createdAt: string;
};

function parseDatabaseDate(value: string) {
	const normalized = value.includes('T') ? value : `${value.replace(' ', 'T')}Z`;
	return new Date(normalized).getTime();
}

function relativeTime(value: string, now: number) {
	const seconds = Math.round((parseDatabaseDate(value) - now) / 1000);
	const formatter = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });
	const absolute = Math.abs(seconds);
	if (absolute < 60) return formatter.format(seconds, 'second');
	if (absolute < 3_600) return formatter.format(Math.round(seconds / 60), 'minute');
	if (absolute < 86_400) return formatter.format(Math.round(seconds / 3_600), 'hour');
	if (absolute < 2_592_000) return formatter.format(Math.round(seconds / 86_400), 'day');
	return formatter.format(Math.round(seconds / 2_592_000), 'month');
}

function originalUrl(photo: PublicPhoto, download = false) {
	return `/api/photos/${photo.storedName}${download ? '?download=1' : ''}`;
}

export default function PublicPhotoGallery({ photos }: { photos: PublicPhoto[] }) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
	const [now, setNow] = useState(() => Date.now());
	const thumbRefs = useRef(new Map<number, HTMLButtonElement>());
	const times = useMemo(() => new Map(photos.map((photo) => [photo.id, relativeTime(photo.createdAt, now)])), [photos, now]);
	const selected = selectedIndex == null ? null : photos[selectedIndex] ?? null;
	const hasMultiple = photos.length > 1;

	const go = (delta: number) => {
		setSelectedIndex((current) => {
			if (current == null || photos.length === 0) return current;
			return (current + delta + photos.length) % photos.length;
		});
	};

	useEffect(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 15_000);
		return () => window.clearInterval(timer);
	}, []);

	useEffect(() => {
		if (selectedIndex == null) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedIndex(null);
			else if (event.key === 'ArrowLeft') {
				setSelectedIndex((current) => (current == null || photos.length === 0 ? current : (current - 1 + photos.length) % photos.length));
			} else if (event.key === 'ArrowRight') {
				setSelectedIndex((current) => (current == null || photos.length === 0 ? current : (current + 1) % photos.length));
			}
		};

		window.addEventListener('keydown', onKey);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKey);
		};
	}, [selectedIndex, photos.length]);

	useEffect(() => {
		if (selectedIndex == null) return;
		const photo = photos[selectedIndex];
		if (!photo) return;
		thumbRefs.current.get(photo.id)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	}, [selectedIndex, photos]);

	return (
		<>
			<div className="mt-7 columns-1 gap-4 sm:columns-2 lg:columns-3">
				{photos.map((photo, index) => (
					<figure className="mb-4 break-inside-avoid overflow-hidden border border-gold/35 bg-ink/70" key={photo.id}>
						<button className="group block w-full cursor-zoom-in overflow-hidden text-left" type="button" onClick={() => setSelectedIndex(index)} aria-label={`Ampliar foto de ${photo.uploaderName}`}>
							<img className="block h-auto w-full transition duration-500 group-hover:scale-[1.02]" src={`/api/photos/thumbnails/${photo.id}`} alt={`Foto compartida por ${photo.uploaderName}`} loading="lazy" />
						</button>
						<figcaption className="flex items-center justify-between gap-3 px-3 py-2.5 font-ui text-[9px] uppercase tracking-[.12em] text-ivory/50">
							<span className="min-w-0">
								<span className="block truncate text-gold">{photo.uploaderName}</span>
								<span className="mt-0.5 block text-ivory/35">{times.get(photo.id)}</span>
							</span>
							<a className="inline-flex size-8 shrink-0 items-center justify-center border border-ivory/15 text-ivory/55 transition hover:border-gold hover:text-gold" href={originalUrl(photo, true)} download={photo.originalName} aria-label={`Descargar foto de ${photo.uploaderName}`} title="Descargar foto">
								<Icon icon="lucide:download" width="14" />
							</a>
						</figcaption>
					</figure>
				))}
			</div>

			{selected && selectedIndex != null && (
				<div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-3 text-ivory backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`Foto de ${selected.uploaderName}`} onClick={() => setSelectedIndex(null)}>
					<div className="flex shrink-0 items-center justify-between gap-4 pb-3">
						<div className="min-w-0 font-ui text-[10px] uppercase tracking-[.15em]">
							<p className="truncate text-gold">{selected.uploaderName}</p>
							<p className="mt-1 text-ivory/40">
								{times.get(selected.id)}
								{hasMultiple && (
									<span className="text-ivory/25">
										{' · '}
										{String(selectedIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
									</span>
								)}
							</p>
						</div>
						<div className="flex gap-2">
							<a className="inline-flex h-10 items-center gap-2 border border-gold/50 px-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] text-gold transition hover:bg-gold hover:text-ink" href={originalUrl(selected, true)} download={selected.originalName} onClick={(event) => event.stopPropagation()}>
								<Icon icon="lucide:download" width="15" /> <span className="hidden sm:inline">Descargar</span>
							</a>
							<button className="inline-flex size-10 items-center justify-center border border-ivory/25 text-ivory transition hover:border-gold hover:text-gold" type="button" onClick={() => setSelectedIndex(null)} aria-label="Cerrar foto">
								<Icon icon="lucide:x" width="20" />
							</button>
						</div>
					</div>

					<div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
						{hasMultiple && (
							<button
								className="absolute left-0 z-10 border border-ivory/25 bg-ink/70 p-3 text-ivory/80 transition hover:border-gold hover:text-gold sm:left-2"
								type="button"
								onClick={() => go(-1)}
								aria-label="Foto anterior"
							>
								<Icon icon="lucide:chevron-left" width="20" />
							</button>
						)}

						<img
							className="max-h-[min(68vh,52rem)] max-w-[min(100%,calc(100%-5.5rem))] object-contain shadow-[0_30px_80px_rgba(0,0,0,.55)] sm:max-h-[min(72vh,56rem)]"
							src={originalUrl(selected)}
							alt={`Foto compartida por ${selected.uploaderName}`}
						/>

						{hasMultiple && (
							<button
								className="absolute right-0 z-10 border border-ivory/25 bg-ink/70 p-3 text-ivory/80 transition hover:border-gold hover:text-gold sm:right-2"
								type="button"
								onClick={() => go(1)}
								aria-label="Foto siguiente"
							>
								<Icon icon="lucide:chevron-right" width="20" />
							</button>
						)}
					</div>

					{hasMultiple && (
						<div className="mt-4 shrink-0 border-t border-ivory/10 pt-4" onClick={(event) => event.stopPropagation()}>
							<p className="mb-3 text-center font-ui text-[9px] font-bold uppercase tracking-[.22em] text-ivory/35">Galería</p>
							<div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{photos.map((photo, index) => {
									const active = index === selectedIndex;
									return (
										<button
											ref={(node) => {
												if (node) thumbRefs.current.set(photo.id, node);
												else thumbRefs.current.delete(photo.id);
											}}
											className={`relative shrink-0 overflow-hidden border transition ${active ? 'border-gold ring-2 ring-gold/40' : 'border-ivory/15 opacity-55 hover:border-gold/50 hover:opacity-100'}`}
											type="button"
											key={photo.id}
											onClick={() => setSelectedIndex(index)}
											aria-label={`Ver foto de ${photo.uploaderName}`}
											aria-current={active}
										>
											<img className="size-16 object-cover sm:size-20" src={`/api/photos/thumbnails/${photo.id}`} alt="" loading="lazy" />
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}
