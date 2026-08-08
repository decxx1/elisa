import { Icon } from '@iconify/react';
import RsvpFormFields from '@/components/rsvp/RsvpFormFields';
import type { RsvpForm, RsvpStatus } from '@/lib/rsvp';
import type { FormEvent } from 'react';

type RsvpSectionProps = {
	confirmed: number;
	form: RsvpForm;
	status: RsvpStatus;
	saving: boolean;
	onUpdate: (field: keyof RsvpForm, value: string | boolean) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function RsvpSection({ confirmed, form, status, saving, onUpdate, onSubmit }: RsvpSectionProps) {
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
				<form className="reveal pt-2" onSubmit={onSubmit}>
					<RsvpFormFields form={form} status={status} saving={saving} onUpdate={onUpdate} />
				</form>
			</div>
		</section>
	);
}
