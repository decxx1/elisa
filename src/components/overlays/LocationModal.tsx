import { Icon } from '@iconify/react';
import { MAP_EMBED_SRC, MAP_LINK } from '@/lib/event';

type LocationModalProps = {
	onClose: () => void;
};

export default function LocationModal({ onClose }: LocationModalProps) {
	return (
		<div className="fixed inset-0 z-[65] flex items-center justify-center p-4 sm:p-6" role="presentation">
			<button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" type="button" aria-label="Cerrar ubicación" onClick={onClose} />
			<div
				className="guestbook-modal relative w-[min(36rem,100%)] overflow-hidden border border-gold/40 bg-ink text-ivory shadow-[0_24px_60px_rgba(0,0,0,.5)]"
				role="dialog"
				aria-modal="true"
				aria-label="Punto de encuentro"
			>
				<button
					className="absolute right-3 top-3 z-10 border border-ivory/20 bg-ink/80 p-2 text-ivory/70 transition hover:border-gold hover:text-gold"
					type="button"
					onClick={onClose}
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
	);
}
