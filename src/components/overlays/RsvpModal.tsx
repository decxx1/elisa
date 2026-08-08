import { Icon } from '@iconify/react';
import RsvpFormFields from '@/components/rsvp/RsvpFormFields';
import type { RsvpForm, RsvpStatus } from '@/lib/rsvp';
import type { FormEvent } from 'react';

type RsvpModalProps = {
	form: RsvpForm;
	status: RsvpStatus;
	saving: boolean;
	onUpdate: (field: keyof RsvpForm, value: string | boolean) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onClose: () => void;
};

export default function RsvpModal({ form, status, saving, onUpdate, onSubmit, onClose }: RsvpModalProps) {
	return (
		<div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-8" role="presentation">
			<button className="absolute inset-0 bg-ink/85 backdrop-blur-sm" type="button" aria-label="Cerrar formulario" onClick={onClose} />
			<div
				className="guestbook-modal relative max-h-[min(92vh,44rem)] w-[min(36rem,100%)] overflow-y-auto overscroll-contain border border-gold-dark/30 bg-paper px-5 py-6 text-ink shadow-[0_30px_80px_rgba(0,0,0,.55)] sm:px-8 sm:py-8"
				role="dialog"
				aria-modal="true"
				aria-label="Confirmar presencia"
			>
				<button
					className="absolute right-4 top-4 border border-ink/15 p-2 text-ink/55 transition hover:border-gold-dark hover:text-gold-dark"
					type="button"
					onClick={onClose}
					aria-label="Cerrar formulario"
				>
					<Icon icon="lucide:x" width="16" />
				</button>
				<p className="eyebrow text-ink/55">Acceso rápido</p>
				<h2 className="mt-3 max-w-sm font-display text-5xl leading-[.88] tracking-[-.05em] sm:text-6xl">
					¿Venís
					<br />
					<span className="text-gold-dark">al club?</span>
				</h2>
				<p className="mt-4 max-w-sm font-serif text-xl leading-tight text-ink/65">Confirmá tu presencia y dejá tu mensaje.</p>
				<form className="mt-8 pt-2" onSubmit={onSubmit}>
					<RsvpFormFields form={form} status={status} saving={saving} onUpdate={onUpdate} />
				</form>
			</div>
		</div>
	);
}
