import { Icon } from '@iconify/react';
import type { GuestbookFilter, GuestbookSort, GuestNote } from '@/lib/guestbook';

type GuestbookModalProps = {
	statsConfirmed: number;
	guests: GuestNote[];
	visibleGuests: GuestNote[];
	activeGuestId: number | null;
	guestbookFilter: GuestbookFilter;
	guestbookSort: GuestbookSort;
	onFilterChange: (filter: GuestbookFilter) => void;
	onSortChange: (sort: GuestbookSort) => void;
	onSelectGuest: (id: number) => void;
	onOpenRsvp: () => void;
	onClose: () => void;
};

export default function GuestbookModal({
	statsConfirmed,
	guests,
	visibleGuests,
	activeGuestId,
	guestbookFilter,
	guestbookSort,
	onFilterChange,
	onSortChange,
	onSelectGuest,
	onOpenRsvp,
	onClose
}: GuestbookModalProps) {
	const featured = visibleGuests.find((guest) => guest.id === activeGuestId) ?? visibleGuests[0];

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8" role="presentation">
			<button className="absolute inset-0 bg-ink/80 backdrop-blur-sm" type="button" aria-label="Cerrar modal" onClick={onClose} />
			<div
				className="guestbook-modal relative flex max-h-[min(90vh,54rem)] w-[min(72rem,100%)] flex-col overflow-hidden border border-gold/40 bg-ink text-ivory shadow-[0_30px_80px_rgba(0,0,0,.55)]"
				role="dialog"
				aria-modal="true"
				aria-label="Lista dorada ampliada"
			>
				<button
					className="absolute right-4 top-4 z-10 border border-ivory/20 bg-ink/80 p-2.5 text-ivory/70 transition hover:border-gold hover:text-gold sm:right-6 sm:top-6"
					type="button"
					onClick={onClose}
					aria-label="Cerrar modal"
				>
					<Icon icon="lucide:x" width="16" />
				</button>

				<div className="border-b border-ivory/10 px-5 py-5 pr-16 sm:px-8 sm:pr-20">
					<p className="font-ui text-[10px] font-bold uppercase tracking-[.28em] text-gold">Lista dorada</p>
					<h2 className="mt-2 font-display text-5xl leading-[.88] tracking-[-.05em] sm:text-7xl">
						Saludos
						<br />
						<span className="text-gold">para Elisa.</span>
					</h2>
					<p className="mt-3 font-ui text-[10px] uppercase tracking-[.2em] text-ivory/45">
						{statsConfirmed} confirmados · {visibleGuests.length} en vista
					</p>

					<div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
						<div className="flex flex-wrap items-end gap-3">
							<label className="block min-w-[10rem]">
								<span className="mb-1.5 block font-ui text-[8px] font-bold uppercase tracking-[.2em] text-ivory/40">Filtrar</span>
								<select
									className="guestbook-select w-full"
									value={guestbookFilter}
									onChange={(event) => onFilterChange(event.target.value as GuestbookFilter)}
								>
									<option value="all">Todos</option>
									<option value="confirmed">Confirmados</option>
									<option value="declined">No asisten</option>
								</select>
							</label>
							<label className="block min-w-[10rem]">
								<span className="mb-1.5 block font-ui text-[8px] font-bold uppercase tracking-[.2em] text-ivory/40">Orden</span>
								<select
									className="guestbook-select w-full"
									value={guestbookSort}
									onChange={(event) => onSortChange(event.target.value as GuestbookSort)}
								>
									<option value="newest">Recientes</option>
									<option value="oldest">Antiguos</option>
								</select>
							</label>
							<button
								className="inline-flex items-center gap-2 border border-gold bg-gold px-4 py-2.5 font-ui text-[9px] font-bold uppercase tracking-[.18em] text-ink transition hover:bg-ivory"
								type="button"
								onClick={onOpenRsvp}
							>
								<Icon icon="lucide:pen-line" width="13" />
								Dejar mi saludo
							</button>
						</div>
						<p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ui text-[9px] uppercase tracking-[.16em] text-ivory/45">
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" /> Asiste
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-2 rounded-full bg-rose-400" aria-hidden="true" /> No asiste
							</span>
						</p>
					</div>
				</div>

				<div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[1.1fr_.9fr]">
					<div className="min-h-0 overflow-y-auto overscroll-contain border-b border-ivory/10 p-3 sm:p-4 lg:border-b-0 lg:border-r">
						{visibleGuests.length === 0 ? (
							<p className="px-4 py-16 text-center font-serif text-2xl text-ivory/50">
								{guests.length === 0 ? 'Todavía no hay saludos para Elisa.' : 'Nadie en este filtro por ahora.'}
							</p>
						) : (
							<ul className="space-y-2">
								{visibleGuests.map((guest) => {
									const active = guest.id === activeGuestId;
									const attending = Boolean(guest.attending);
									return (
										<li key={guest.id}>
											<button
												className={`w-full border px-4 py-3.5 text-left transition ${active ? 'border-gold/60 bg-gold/10' : 'border-ivory/10 hover:border-ivory/25 hover:bg-ivory/5'}`}
												type="button"
												onClick={() => onSelectGuest(guest.id)}
												aria-pressed={active}
											>
												<div className="flex items-center gap-3">
													<span className={`size-2.5 shrink-0 rounded-full ${attending ? 'bg-emerald-400' : 'bg-rose-400'}`} aria-hidden="true" />
													<span className="font-ui text-xs font-bold uppercase tracking-[.2em] text-gold">{guest.name}</span>
												</div>
											</button>
										</li>
									);
								})}
							</ul>
						)}
					</div>

					<div className="flex min-h-0 flex-col justify-between gap-8 overflow-y-auto overscroll-contain bg-ivory/[0.03] p-6 sm:p-8">
						{!featured ? (
							<p className="font-serif text-2xl text-ivory/45">Elegí un saludo de la lista.</p>
						) : (
							<>
								<div>
									<h3 className="font-display text-4xl tracking-[-.04em] text-ivory sm:text-5xl">{featured.name}</h3>
									<p className="mt-3 font-ui text-[10px] uppercase tracking-[.2em] text-ivory/40">
										{featured.attending ? 'Confirmó asistencia' : 'No podrá asistir'}
									</p>
									{featured.message ? (
										<blockquote className="mt-8 border-l border-gold/50 pl-5 font-serif text-2xl leading-[1.35] text-ivory/85 sm:text-3xl">
											“{featured.message}”
										</blockquote>
									) : (
										<p className="mt-8 font-serif text-2xl text-ivory/50">Sin mensaje, pero presente en la lista.</p>
									)}
								</div>
								<p className="font-ui text-[9px] uppercase tracking-[.22em] text-ivory/30">
									{new Date(featured.createdAt).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
								</p>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
