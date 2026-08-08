import { Icon } from '@iconify/react';
import { MAP_LINK } from '@/lib/event';

export default function LugarSection() {
	return (
		<section className="relative overflow-hidden bg-ink px-6 py-20 text-center sm:px-12" id="lugar">
			<div className="deco-sunburst absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 opacity-20" aria-hidden="true" />
			<div className="relative mx-auto max-w-2xl">
				<p className="eyebrow justify-center">El punto de encuentro</p>
				<h2 className="mt-6 font-serif text-4xl text-ivory sm:text-6xl">Casa Quincho MC</h2>
				<p className="mt-4 font-ui text-sm text-ivory/60">Adolfo Calle 974 · Las Heras · Barrio Parque Norte</p>
				<a
					className="mt-8 inline-flex items-center gap-2 border-b border-gold pb-2 font-ui text-xs font-bold uppercase tracking-[.22em] text-gold transition hover:text-ivory"
					href={MAP_LINK}
					target="_blank"
					rel="noreferrer"
				>
					Abrir ubicación <Icon icon="lucide:map-pin" width="16" />
				</a>
			</div>
		</section>
	);
}
