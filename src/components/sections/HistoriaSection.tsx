import { Icon } from '@iconify/react';

export default function HistoriaSection() {
	return (
		<section className="relative overflow-hidden bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="historia">
			<div className="deco-sunburst absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-20" aria-hidden="true" />
			<div className="relative mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
				<div className="reveal lg:sticky lg:top-32 lg:h-fit">
					<p className="eyebrow text-ink/55">Desde 1924</p>
					<h2 className="mt-5 max-w-md font-display text-6xl leading-[.88] tracking-[-.05em] text-ink sm:text-8xl">
						Una vida
						<br />
						<span className="text-gold-dark">102 años</span>
					</h2>
					<div className="mt-10 flex items-center gap-3 font-ui text-[10px] font-bold uppercase tracking-[.25em] text-gold-dark">
						<span className="h-px w-8 bg-gold-dark" /> Te espero
					</div>
				</div>
				<div className="relative space-y-14 font-serif text-2xl leading-[1.25] text-ink/70 sm:text-3xl">
					<div className="deco-corner reveal absolute -right-5 -top-8 hidden size-28 border-r border-t border-gold-dark/60 sm:block" aria-hidden="true" />
					<p className="reveal">El tiempo pasa, pero el estilo y la alegría permanecen.</p>
					<p className="reveal text-ink">
						Te espero para hacer un viaje a la época del jazz y celebrar juntos mis <span className="text-gold-dark">102 años</span>.
					</p>
					<div className="reveal text-center flex sm:grid gap-3 border-y border-ink/15 py-6 font-ui text-[10px] sm:text-xs font-medium uppercase tracking-[.18em] text-ink/60 sm:grid-cols-3">
						<span className="flex flex-col sm:flex-row items-center gap-2">
							<Icon className="text-gold-dark" icon="lucide:sparkles" width="16" /> Años dorados
						</span>
						<span className="flex flex-col sm:flex-row items-center gap-2">
							<Icon className="text-gold-dark" icon="lucide:feather" width="16" /> Estilo flapper
						</span>
						<span className="flex flex-col sm:flex-row items-center gap-2">
							<Icon className="text-gold-dark" icon="lucide:music" width="16" /> Jazz y charleston
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
