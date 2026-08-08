import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function ContrasenaSection() {
	const [passwordVisible, setPasswordVisible] = useState(false);

	return (
		<section className="relative overflow-hidden bg-ink px-6 py-24 sm:px-12 lg:px-20" id="contrasena">
			<div className="deco-sunburst absolute left-1/2 top-0 size-[28rem] -translate-x-1/2 -translate-y-1/3 opacity-15" aria-hidden="true" />
			<div className="pointer-events-none absolute inset-x-8 top-10 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:block" aria-hidden="true" />
			<div className="relative mx-auto max-w-4xl">
				<div className="reveal text-center">
					<h2 className="font-display text-6xl leading-[.88] tracking-[-.05em] text-ivory sm:text-8xl">
						El piso de
						<br />
						<span className="text-gold">arriba.</span>
					</h2>
				</div>

				<div className="reveal mt-14 space-y-8 border-y border-ivory/15 py-12 text-center font-serif text-2xl leading-[1.35] text-ivory/75 sm:text-3xl">
					<p className="inline-flex items-center justify-center gap-3 border border-gold/50 px-4 py-2 font-ui text-[10px] font-bold uppercase tracking-[.32em] text-gold">
						<Icon icon="lucide:siren" width="14" /> Atención
					</p>
					<p>Circulan rumores de que las autoridades vigilan la zona.</p>
				</div>
				<div className="reveal space-y-8 border-b border-ivory/15 py-12 text-center font-serif text-2xl leading-[1.35] text-ivory/75 sm:text-3xl">
					<p>
						El almuerzo en el restaurante Elisa es completamente legal: fingiremos ser ciudadanos ejemplares. Pero si ves una escalera y querés acceder
						arriba, deberás convencer al portero.
					</p>
				</div>

				<div className="reveal mx-auto mt-12 max-w-xl text-center">
					<p className="font-ui text-xs font-bold uppercase tracking-[.28em] text-ivory/80">La contraseña es</p>
					<button
						className="mt-5 flex w-full items-center justify-between border border-gold/60 px-5 py-5 text-left transition hover:bg-gold hover:text-ink"
						type="button"
						onClick={() => setPasswordVisible((visible) => !visible)}
						aria-expanded={passwordVisible}
					>
						<span className="font-ui text-sm font-bold uppercase tracking-[.28em]">{passwordVisible ? 'AlCapone' : 'Tocar para revelar'}</span>
						<Icon icon={passwordVisible ? 'lucide:eye-off' : 'lucide:key-round'} width="18" />
					</button>
					<p className="mt-4 font-ui text-xs font-bold uppercase tracking-[.22em] text-gold/80">Si te atrapa la policía, nosotros no te conocemos.</p>
				</div>
			</div>
		</section>
	);
}
