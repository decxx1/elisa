import { Icon } from '@iconify/react';

type MobileTabBarProps = {
	guestbookOpen: boolean;
	guestCount: number;
	onOpenLocation: () => void;
	onToggleGuestbook: () => void;
	onOpenRsvp: () => void;
	onOpenDate: () => void;
};

export default function MobileTabBar({
	guestbookOpen,
	guestCount,
	onOpenLocation,
	onToggleGuestbook,
	onOpenRsvp,
	onOpenDate
}: MobileTabBarProps) {
	return (
		<nav
			className="fixed inset-x-0 bottom-0 z-50 border-t border-ivory/10 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
			aria-label="Accesos rápidos"
		>
			<div className="mx-auto grid max-w-lg grid-cols-4">
				<button
					className="flex flex-col items-center gap-1 px-1.5 py-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] text-ivory/70 transition hover:text-gold"
					type="button"
					onClick={onOpenRsvp}
				>
					<Icon icon="lucide:pen-line" width="18" />
					Reservar
				</button>
				<button
					className="flex flex-col items-center gap-1 px-1.5 py-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] text-ivory/70 transition hover:text-gold"
					type="button"
					onClick={onOpenLocation}
				>
					<Icon icon="lucide:map-pin" width="18" />
					Ubicación
				</button>
				<button
					className={`relative flex flex-col items-center gap-1 px-1.5 py-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] transition ${guestbookOpen ? 'text-gold' : 'text-ivory/70 hover:text-gold'}`}
					type="button"
					onClick={onToggleGuestbook}
					aria-pressed={guestbookOpen}
				>
					<Icon icon={guestbookOpen ? 'lucide:x' : 'lucide:book-heart'} width="18" />
					{guestbookOpen ? 'Cerrar' : 'Saludos'}
					{!guestbookOpen && guestCount > 0 && (
						<span className="absolute right-[12%] top-2 flex min-w-4 items-center justify-center bg-gold px-1 py-0.5 font-ui text-[8px] font-bold text-ink">
							{guestCount}
						</span>
					)}
				</button>
				<button
					className="flex flex-col items-center gap-1 px-1.5 py-3 font-ui text-[9px] font-bold uppercase tracking-[.14em] text-ivory/70 transition hover:text-gold"
					type="button"
					onClick={onOpenDate}
				>
					<Icon icon="lucide:calendar-days" width="18" />
					Fecha
				</button>
			</div>
		</nav>
	);
}
