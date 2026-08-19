import { Icon } from '@iconify/react';

type DesktopQuickActionsProps = {
	guestbookOpen: boolean;
	guestCount: number;
	onOpenDate: () => void;
	onOpenLocation: () => void;
	onToggleGuestbook: () => void;
};

export default function DesktopQuickActions({ guestbookOpen, guestCount, onOpenDate, onOpenLocation, onToggleGuestbook }: DesktopQuickActionsProps) {
	return (
		<div className="pointer-events-auto hidden flex-col items-end gap-2 lg:flex">
			<a
				className="guestbook-fab flex items-center gap-2 border border-gold bg-gold px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ink shadow-[0_10px_30px_rgba(197,154,74,.3)] transition hover:bg-ivory"
				href="/fotos"
			>
				<Icon icon="lucide:camera" width="14" />
				<span>Subir fotos</span>
			</a>
			<button
				className="guestbook-fab flex items-center gap-2 border border-gold/70 bg-ink/90 px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ivory shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-ink"
				type="button"
				onClick={onOpenDate}
				aria-label="Ver fecha del evento"
			>
				<Icon icon="lucide:calendar-days" width="14" />
				<span>Fecha</span>
			</button>
			<button
				className="guestbook-fab flex items-center gap-2 border border-gold/70 bg-ink/90 px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ivory shadow-[0_8px_24px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-ink"
				type="button"
				onClick={onOpenLocation}
				aria-label="Ver ubicación"
			>
				<Icon icon="lucide:map-pin" width="14" />
				<span>Ubicación</span>
			</button>
			<button
				className="guestbook-fab relative flex items-center gap-2 border border-gold/70 bg-gold px-3.5 py-2.5 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-ink shadow-[0_10px_30px_rgba(197,154,74,.35)] transition hover:bg-ivory"
				type="button"
				onClick={onToggleGuestbook}
				aria-expanded={guestbookOpen}
				aria-controls="guestbook-panel"
				aria-label={guestbookOpen ? 'Cerrar lista dorada' : 'Abrir lista dorada'}
			>
				<Icon icon={guestbookOpen ? 'lucide:x' : 'lucide:book-heart'} width="14" />
				<span>{guestbookOpen ? 'Cerrar' : 'Saludos'}</span>
				{!guestbookOpen && guestCount > 0 && (
					<span className="absolute -right-2 -top-2 flex min-w-5 items-center justify-center bg-ink px-1.5 py-0.5 font-ui text-[9px] font-bold text-gold">
						{guestCount}
					</span>
				)}
			</button>
		</div>
	);
}
