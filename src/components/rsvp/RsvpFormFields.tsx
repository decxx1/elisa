import { Icon } from '@iconify/react';
import { NAME_MAX, MESSAGE_MAX } from '@/lib/guestbook';
import type { RsvpForm, RsvpStatus } from '@/lib/rsvp';

type RsvpFormFieldsProps = {
	form: RsvpForm;
	status: RsvpStatus;
	saving: boolean;
	onUpdate: (field: keyof RsvpForm, value: string | boolean) => void;
};

export default function RsvpFormFields({ form, status, saving, onUpdate }: RsvpFormFieldsProps) {
	return (
		<>
			<label className="field-label">
				<span className="flex items-center justify-between gap-3">
					<span>Nombre completo</span>
					<span className="font-normal normal-case tracking-normal text-ink/35">
						{form.name.length}/{NAME_MAX}
					</span>
				</span>
				<input
					className="field-input"
					name="name"
					required
					maxLength={NAME_MAX}
					value={form.name}
					onChange={(event) => onUpdate('name', event.target.value)}
					placeholder="Tu nombre y apellido"
				/>
			</label>
			<fieldset className="mt-8">
				<legend className="field-label">¿Te esperamos?</legend>
				<div className="mt-3 grid grid-cols-2 gap-3">
					{(
						[
							[true, 'Sí, ahí estaré'],
							[false, 'No podré asistir']
						] as const
					).map(([value, label]) => (
						<button
							className={`inline-flex items-center gap-2 border px-4 py-2.5 text-left font-ui text-xs font-bold uppercase tracking-[.13em] transition ${
								form.attending === value ? 'border-gold-dark bg-gold-dark text-ivory' : 'border-ink/20 hover:border-gold-dark'
							}`}
							key={String(value)}
							type="button"
							onClick={() => onUpdate('attending', value)}
							aria-pressed={form.attending === value}
						>
							<Icon icon={value ? 'lucide:check' : 'lucide:minus'} width="15" />
							{label}
						</button>
					))}
				</div>
			</fieldset>
			<label className="field-label mt-8 block">
				<span className="flex items-center justify-between gap-3">
					<span>
						Dejá una línea para Elisa <span className="font-normal normal-case tracking-normal text-ink/35">(opcional)</span>
					</span>
					<span className="font-normal normal-case tracking-normal text-ink/35">
						{form.message.length}/{MESSAGE_MAX}
					</span>
				</span>
				<textarea
					className="field-input min-h-28 resize-y"
					name="message"
					maxLength={MESSAGE_MAX}
					value={form.message}
					onChange={(event) => onUpdate('message', event.target.value)}
					placeholder="Un saludo, un recuerdo o una confesión..."
				/>
			</label>
			<div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
				<button
					className="group inline-flex items-center gap-3 bg-ink px-6 py-4 font-ui text-xs font-bold uppercase tracking-[.2em] text-ivory transition hover:bg-gold-dark disabled:cursor-wait disabled:opacity-60"
					disabled={saving}
					type="submit"
				>
					{saving ? 'Guardando...' : 'Enviar'}
					<Icon className="transition-transform group-hover:translate-x-1" icon="lucide:arrow-up-right" width="16" />
				</button>
				<p
					className={`font-ui text-xs ${status.type === 'error' ? 'text-red-700' : status.type === 'success' ? 'text-emerald-700' : 'text-ink/45'}`}
					aria-live="polite"
				>
					{status.message || 'Solo pedimos tu nombre para la lista.'}
				</p>
			</div>
		</>
	);
}
