import { Icon } from '@iconify/react';
import RsvpFormFields from '@/components/rsvp/RsvpFormFields';
import type { RsvpForm, RsvpStatus } from '@/lib/rsvp';
import type { FormEvent } from 'react';

type RsvpSectionProps = {
	confirmed: number;
	rsvpOpen: boolean;
	form: RsvpForm;
	status: RsvpStatus;
	saving: boolean;
	onUpdate: (field: keyof RsvpForm, value: string | boolean) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function RsvpSection({ confirmed, rsvpOpen, form, status, saving, onUpdate, onSubmit }: RsvpSectionProps) {
	return (
		<section className="bg-paper px-6 py-24 text-ink sm:px-12 lg:px-20" id="rsvp">
			<div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
				<div className="reveal">
					<p className="eyebrow text-ink/55">Lista dorada</p>
					<h2 className="mt-5 font-display text-7xl leading-[.78] tracking-[-.06em] sm:text-9xl">
						¿Venís
						<br />
						<span className="text-gold-dark">al club?</span>
					</h2>
					<p className="mt-8 max-w-sm font-serif text-2xl leading-tight text-ink/65">Confirmá tu presencia y dejá tu mensaje.</p>
					<div className="mt-10 flex items-center gap-3 font-ui text-xs font-bold uppercase tracking-[.18em] text-gold-dark">
						<Icon icon="lucide:users" width="17" /> {confirmed} confirmados
					</div>
				</div>
				{rsvpOpen ? (
					<form className="reveal pt-2" onSubmit={onSubmit}>
						<RsvpFormFields form={form} status={status} saving={saving} onUpdate={onUpdate} />
					</form>
				) : (
					<div className="reveal flex min-h-64 flex-col justify-center border border-gold-dark/30 bg-white/25 p-6 sm:p-9">
						<Icon className="text-gold-dark" icon="lucide:lock-keyhole" width="28" />
						<p className="mt-5 font-ui text-[10px] font-bold uppercase tracking-[.22em] text-gold-dark">Lista cerrada</p>
						<h3 className="mt-3 font-serif text-3xl text-ink">Los saludos quedaron guardados.</h3>
						<p className="mt-3 max-w-lg font-ui text-sm leading-6 text-ink/60">Ya no recibimos nuevas confirmaciones ni mensajes, pero durante el festejo podés compartir tus fotos con Elisa.</p>
						<a className="mt-6 inline-flex w-fit items-center gap-2 border-b border-gold-dark pb-2 font-ui text-[10px] font-bold uppercase tracking-[.2em] text-gold-dark" href="/fotos">
							Subir fotos <Icon icon="lucide:camera" width="14" />
						</a>
					</div>
				)}
			</div>
		</section>
	);
}
