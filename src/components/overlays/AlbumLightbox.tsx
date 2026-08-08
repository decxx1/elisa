import { Icon } from '@iconify/react';
import type { AlbumPhoto } from '@/lib/album';

type AlbumLightboxProps = {
	photos: AlbumPhoto[];
	index: number;
	onClose: () => void;
	onChange: (index: number) => void;
};

export default function AlbumLightbox({ photos, index, onClose, onChange }: AlbumLightboxProps) {
	const photo = photos[index];
	if (!photo) return null;

	const total = photos.length;
	const go = (delta: number) => onChange((index + delta + total) % total);

	return (
		<div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-8" role="presentation">
			<button className="absolute inset-0 cursor-zoom-out" type="button" aria-label="Cerrar imagen" onClick={onClose} />

			<button
				className="absolute left-3 top-1/2 z-20 -translate-y-1/2 border border-ivory/25 bg-ink/70 p-3 text-ivory/80 transition hover:border-gold hover:text-gold sm:left-6"
				type="button"
				onClick={() => go(-1)}
				aria-label="Foto anterior"
			>
				<Icon icon="lucide:chevron-left" width="20" />
			</button>
			<button
				className="absolute right-3 top-1/2 z-20 -translate-y-1/2 border border-ivory/25 bg-ink/70 p-3 text-ivory/80 transition hover:border-gold hover:text-gold sm:right-6"
				type="button"
				onClick={() => go(1)}
				aria-label="Foto siguiente"
			>
				<Icon icon="lucide:chevron-right" width="20" />
			</button>

			<div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center" role="dialog" aria-modal="true" aria-label={photo.alt}>
				<button
					className="absolute -top-1 right-0 z-20 border border-ivory/25 bg-ink/70 p-2.5 text-ivory/80 transition hover:border-gold hover:text-gold sm:-right-2 sm:-top-2"
					type="button"
					onClick={onClose}
					aria-label="Cerrar imagen"
				>
					<Icon icon="lucide:x" width="18" />
				</button>
				<img
					className="max-h-[min(85vh,56rem)] w-auto max-w-full object-contain shadow-[0_30px_80px_rgba(0,0,0,.55)]"
					src={photo.src}
					alt={photo.alt}
				/>
				<p className="mt-4 flex items-center gap-3 font-ui text-[10px] font-bold uppercase tracking-[.28em] text-ivory/70">
					<span>Álbum</span>
					<span className="text-gold">
						{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
					</span>
				</p>
			</div>
		</div>
	);
}
