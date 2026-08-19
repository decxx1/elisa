import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

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
	const [selected, setSelected] = useState<PublicPhoto | null>(null);
	const [now, setNow] = useState(() => Date.now());
	const times = useMemo(() => new Map(photos.map((photo) => [photo.id, relativeTime(photo.createdAt, now)])), [photos, now]);

	useEffect(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 15_000);
		return () => window.clearInterval(timer);
	}, []);

	useEffect(() => {
		if (!selected) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelected(null);
		};
		window.addEventListener('keydown', closeOnEscape);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', closeOnEscape);
		};
	}, [selected]);

	return (
		<>
			<div className="mt-7 columns-1 gap-4 sm:columns-2 lg:columns-3">
				{photos.map((photo) => (
					<figure className="mb-4 break-inside-avoid overflow-hidden border border-gold/35 bg-ink/70" key={photo.id}>
						<button className="group block w-full cursor-zoom-in overflow-hidden text-left" type="button" onClick={() => setSelected(photo)} aria-label={`Ampliar foto de ${photo.uploaderName}`}>
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

			{selected && (
				<div className="fixed inset-0 z-[100] flex flex-col bg-black/95 p-3 text-ivory backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-label={`Foto de ${selected.uploaderName}`} onClick={() => setSelected(null)}>
					<div className="flex items-center justify-between gap-4 pb-3">
						<div className="min-w-0 font-ui text-[10px] uppercase tracking-[.15em]">
							<p className="truncate text-gold">{selected.uploaderName}</p>
							<p className="mt-1 text-ivory/40">{times.get(selected.id)}</p>
						</div>
						<div className="flex gap-2">
							<a className="inline-flex h-10 items-center gap-2 border border-gold/50 px-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] text-gold transition hover:bg-gold hover:text-ink" href={originalUrl(selected, true)} download={selected.originalName} onClick={(event) => event.stopPropagation()}>
								<Icon icon="lucide:download" width="15" /> <span className="hidden sm:inline">Descargar</span>
							</a>
							<button className="inline-flex size-10 items-center justify-center border border-ivory/25 text-ivory transition hover:border-gold hover:text-gold" type="button" onClick={() => setSelected(null)} aria-label="Cerrar foto">
								<Icon icon="lucide:x" width="20" />
							</button>
						</div>
					</div>
					<div className="flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
						<img className="max-h-full max-w-full object-contain" src={originalUrl(selected)} alt={`Foto compartida por ${selected.uploaderName}`} />
					</div>
				</div>
			)}
		</>
	);
}
