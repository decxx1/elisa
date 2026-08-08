import { Icon } from '@iconify/react';
import { useCountdown } from '@/hooks/useCountdown';
import { pad, type Countdown } from '@/lib/event';

const countdownUnits: [keyof Countdown, string][] = [
	['days', 'días'],
	['hours', 'horas'],
	['minutes', 'min'],
	['seconds', 'seg']
];

export default function ProgramaSection() {
	const countdownState = useCountdown();

	return (
		<section className="relative overflow-hidden bg-gold px-6 py-24 text-ink sm:px-12 lg:px-20" id="programa">
			<div className="pointer-events-none absolute -right-16 top-8 size-72 rounded-full border border-ink/10 sm:size-[28rem]" aria-hidden="true" />
			<div className="pointer-events-none absolute -right-4 top-20 size-48 rounded-full border border-ink/20 sm:size-[20rem]" aria-hidden="true" />
			<div className="relative mx-auto max-w-7xl">
				<div className="reveal grid gap-16 lg:grid-cols-2 lg:gap-24">
					<div>
						<p className="eyebrow text-ink/55">Brindis &amp; banquete</p>
						<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl text-ivory">
							El menú
							<br />
							<span className="text-ink">del día.</span>
						</h2>
						<p className="mt-8 max-w-md font-serif text-2xl leading-tight text-ink/70">
							Disfrutemos un buen asado, sigamos brindando con dulces y cerremos con la infaltable torta.
						</p>
						<ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/20 pt-8 font-ui text-xs font-bold uppercase tracking-[.2em]">
							<li className="flex items-center gap-3">
								<Icon className="text-ivory" icon="lucide:beef" width="16" /> Buen asado
							</li>
							<li className="flex items-center gap-3">
								<Icon className="text-ivory" icon="lucide:wine" width="16" /> Bebidas legales
							</li>
							<li className="flex items-center gap-3">
								<Icon className="text-ivory" icon="lucide:cake-slice" width="16" /> Torta y dulces
							</li>
						</ul>
					</div>
					<div>
						<p className="eyebrow text-ink/55">Hasta que llegue el gran día</p>
						<h2 className="mt-5 font-display text-6xl leading-[.88] tracking-[-.05em] sm:text-8xl">
							La cuenta
							<br />
							regresiva.
						</h2>
						<p className="mt-8 font-ui text-sm font-bold uppercase tracking-[0.28em] text-ivory">Miércoles 19 de agosto</p>
						{countdownState?.phase === 'live' ? (
							<p className="mt-6 border-t border-ink/20 pt-8 font-display text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">
								Es ahora<span className="text-ivory">.</span>
							</p>
						) : countdownState?.phase === 'ended' ? (
							<p className="mt-6 border-t border-ink/20 pt-8 font-display text-5xl leading-[.9] tracking-[-.04em] sm:text-7xl">
								Ya finalizó<span className="text-ivory">.</span>
							</p>
						) : (
							<div className="mt-6 grid grid-cols-4 gap-3 border-t border-ink/20 pt-8 font-ui sm:gap-6">
								{countdownUnits.map(([key, label]) => (
									<div className="text-center" key={key}>
										<p className="font-display text-5xl sm:text-7xl">{countdownState ? pad(countdownState.countdown[key]) : '--'}</p>
										<p className="mt-2 text-[9px] font-bold uppercase tracking-[.2em] text-ink/80">{label}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
