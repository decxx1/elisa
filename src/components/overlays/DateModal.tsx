import { Icon } from '@iconify/react';

type DateModalProps = {
	onClose: () => void;
};

export default function DateModal({ onClose }: DateModalProps) {
	return (
		<div className="fixed inset-0 z-[65] flex items-center justify-center p-4" role="presentation">
			<button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" type="button" aria-label="Cerrar fecha" onClick={onClose} />
			<div
				className="guestbook-modal relative w-[min(22rem,100%)] border border-gold/50 bg-ink px-6 py-7 text-center text-ivory shadow-[0_24px_60px_rgba(0,0,0,.5)]"
				role="dialog"
				aria-modal="true"
				aria-label="Fecha del evento"
			>
				<button
					className="absolute right-3 top-3 border border-ivory/20 bg-ink/80 p-2 text-ivory/70 transition hover:border-gold hover:text-gold"
					type="button"
					onClick={onClose}
					aria-label="Cerrar fecha"
				>
					<Icon icon="lucide:x" width="14" />
				</button>
				<Icon className="mx-auto text-gold" icon="lucide:calendar-days" width="28" />
				<p className="mt-5 font-ui text-[9px] font-bold uppercase tracking-[.28em] text-gold">La fecha</p>
				<h2 className="mt-3 font-serif text-3xl text-ivory">Miércoles 19 de agosto</h2>
				<p className="mt-3 font-ui text-[10px] uppercase tracking-[.2em] text-ivory/50">De 13:00 Hs a 20:30 Hs</p>
			</div>
		</div>
	);
}
