import { Icon } from '@iconify/react';
import type { AttireLightbox as AttireLook } from '@/lib/guestbook';

type AttireLightboxProps = {
	look: AttireLook;
	onClose: () => void;
};

export default function AttireLightbox({ look, onClose }: AttireLightboxProps) {
	return (
		<div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-8" role="presentation">
			<button className="absolute inset-0 cursor-zoom-out" type="button" aria-label="Cerrar imagen" onClick={onClose} />
			<div className="relative z-10 flex max-h-full w-full max-w-5xl flex-col items-center" role="dialog" aria-modal="true" aria-label={look.alt}>
				<button
					className="absolute -top-1 right-0 z-20 border border-ivory/25 bg-ink/70 p-2.5 text-ivory/80 transition hover:border-gold hover:text-gold sm:-right-2 sm:-top-2"
					type="button"
					onClick={onClose}
					aria-label="Cerrar imagen"
				>
					<Icon icon="lucide:x" width="18" />
				</button>
				<img className="max-h-[min(85vh,56rem)] w-auto max-w-full object-contain shadow-[0_30px_80px_rgba(0,0,0,.55)]" src={look.src} alt={look.alt} />
				<p className="mt-4 flex items-center gap-3 font-ui text-[10px] font-bold uppercase tracking-[.28em] text-ivory/70">
					<span>{look.label}</span>
					<span className="text-gold">{look.detail}</span>
				</p>
			</div>
		</div>
	);
}
