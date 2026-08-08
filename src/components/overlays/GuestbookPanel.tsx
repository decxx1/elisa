import { Icon } from '@iconify/react';
import type { GuestbookFilter, GuestbookSort, GuestNote } from '@/lib/guestbook';

type GuestbookPanelProps = {
	statsConfirmed: number;
	guests: GuestNote[];
	visibleGuests: GuestNote[];
	activeGuestId: number | null;
	guestbookFilter: GuestbookFilter;
	guestbookSort: GuestbookSort;
	onCycleFilter: () => void;
	onToggleSort: () => void;
	onExpand: (guestId?: number) => void;
	onClose: () => void;
};

export default function GuestbookPanel({
	statsConfirmed,
	guests,
	visibleGuests,
	activeGuestId,
	guestbookFilter,
	guestbookSort,
	onCycleFilter,
	onToggleSort,
	onExpand,
	onClose
}: GuestbookPanelProps) {
	const filterLabel = guestbookFilter === 'all' ? 'Todos' : guestbookFilter === 'confirmed' ? 'Confirmados' : 'No asisten';

	return (
		<div
			className="guestbook-panel pointer-events-auto flex h-[min(28rem,calc(100vh-9rem))] w-full flex-col overflow-hidden border border-gold/40 bg-ink/95 text-ivory shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-md sm:ml-auto sm:h-[min(28rem,70vh)] sm:w-[min(22rem,calc(100vw-2.5rem))]"
			id="guestbook-panel"
			role="dialog"
			aria-label="Lista dorada y saludos"
		>
			<div className="flex items-start justify-between gap-3 border-b border-ivory/10 px-4 py-3">
				<div>
					<p className="font-ui text-[9px] font-bold uppercase tracking-[.28em] text-gold">Lista dorada</p>
					<p className="mt-1 font-serif text-xl text-ivory">{statsConfirmed} confirmados</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						className="border border-ivory/20 p-2 text-ivory/70 transition hover:border-gold hover:text-gold"
						type="button"
						onClick={() => onExpand()}
						aria-label="Expandir lista dorada"
					>
						<Icon icon="lucide:expand" width="14" />
					</button>
					<button
						className="border border-ivory/20 p-2 text-ivory/70 transition hover:border-gold hover:text-gold"
						type="button"
						onClick={onClose}
						aria-label="Cerrar lista"
					>
						<Icon icon="lucide:x" width="14" />
					</button>
				</div>
			</div>

			<div className="flex items-center gap-2 border-b border-ivory/10 px-3 py-2.5">
				<button
					className="inline-flex min-w-0 flex-1 items-center justify-between gap-2 border border-gold/40 bg-gold/10 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.16em] text-gold transition hover:bg-gold/20"
					type="button"
					onClick={onCycleFilter}
					aria-label={`Filtro actual: ${filterLabel}. Cambiar filtro`}
				>
					<span className="truncate">{filterLabel}</span>
					<Icon className="shrink-0 opacity-70" icon="lucide:refresh-cw" width="11" />
				</button>
				<button
					className="inline-flex shrink-0 items-center gap-1.5 border border-ivory/20 px-2.5 py-1.5 font-ui text-[9px] font-bold uppercase tracking-[.16em] text-ivory/70 transition hover:border-gold/50 hover:text-gold"
					type="button"
					onClick={onToggleSort}
					aria-label={`Orden actual: ${guestbookSort === 'newest' ? 'Recientes' : 'Antiguos'}. Cambiar orden`}
				>
					<Icon icon={guestbookSort === 'newest' ? 'lucide:arrow-down-wide-narrow' : 'lucide:arrow-up-narrow-wide'} width="11" />
					{guestbookSort === 'newest' ? 'Recientes' : 'Antiguos'}
				</button>
			</div>

			<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2">
				{visibleGuests.length === 0 ? (
					<p className="px-3 py-8 text-center font-serif text-lg text-ivory/50">
						{guests.length === 0 ? 'Todavía no hay saludos para Elisa.' : 'Nadie en este filtro por ahora.'}
					</p>
				) : (
					<ul className="space-y-1">
						{visibleGuests.map((guest) => {
							const active = guest.id === activeGuestId;
							const attending = Boolean(guest.attending);
							return (
								<li key={guest.id}>
									<button
										className={`w-full border px-3 py-3 text-left transition ${active ? 'border-gold/50 bg-gold/10' : 'border-transparent hover:border-ivory/15 hover:bg-ivory/5'}`}
										type="button"
										data-guest-id={guest.id}
										onClick={() => onExpand(guest.id)}
										aria-pressed={active}
									>
										<div className="flex items-center justify-between gap-2">
											<span className="flex min-w-0 items-center gap-2">
												<span
													className={`size-2 shrink-0 rounded-full ${attending ? 'bg-emerald-400' : 'bg-rose-400'}`}
													aria-label={attending ? 'Confirmó asistencia' : 'No podrá asistir'}
													title={attending ? 'Confirmó asistencia' : 'No podrá asistir'}
												/>
												<span className="truncate font-ui text-[10px] font-bold uppercase tracking-[.18em] text-gold">{guest.name}</span>
											</span>
											{guest.message ? <Icon className="shrink-0 text-ivory/35" icon="lucide:message-circle" width="12" /> : null}
										</div>
										{guest.message ? (
											<p className={`mt-2 font-serif text-base leading-snug text-ivory/75 transition ${active ? 'line-clamp-none' : 'line-clamp-2'}`}>
												“{guest.message}”
											</p>
										) : (
											<p className="mt-2 font-ui text-[10px] uppercase tracking-[.16em] text-ivory/30">Confirmó presencia</p>
										)}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
