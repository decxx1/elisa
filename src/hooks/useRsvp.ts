import { useState, type FormEvent } from 'react';
import { NAME_MAX, MESSAGE_MAX, type GuestNote } from '@/lib/guestbook';
import { emptyRsvpForm, type RsvpForm, type RsvpStatus } from '@/lib/rsvp';

type SubmitResult = {
	stats: { total: number; confirmed: number };
	guests?: GuestNote[];
};

type UseRsvpOptions = {
	onSuccess?: (result: SubmitResult & { attending: boolean; hasMessage: boolean }) => void;
};

export function useRsvp({ onSuccess }: UseRsvpOptions = {}) {
	const [form, setForm] = useState<RsvpForm>(emptyRsvpForm);
	const [status, setStatus] = useState<RsvpStatus>({ type: 'idle', message: '' });
	const [saving, setSaving] = useState(false);
	const [rsvpModalOpen, setRsvpModalOpen] = useState(false);

	function updateForm(field: keyof RsvpForm, value: string | boolean) {
		setForm((current) => {
			if (field === 'name' && typeof value === 'string') {
				return { ...current, name: value.slice(0, NAME_MAX) };
			}
			if (field === 'message' && typeof value === 'string') {
				return { ...current, message: value.slice(0, MESSAGE_MAX) };
			}
			return { ...current, [field]: value };
		});
	}

	function openRsvpModal() {
		setStatus({ type: 'idle', message: '' });
		setRsvpModalOpen(true);
	}

	async function submitRsvp(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSaving(true);
		setStatus({ type: 'idle', message: '' });
		const attending = form.attending;
		const hasMessage = Boolean(form.message.trim());
		try {
			const response = await fetch('/api/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form)
			});
			const data = await response.json();
			if (!response.ok) throw new Error(data.error ?? 'No pudimos guardar tu pase.');
			setStatus({
				type: 'success',
				message: attending
					? 'Tu nombre ya está en la lista dorada.'
					: 'Anotamos que no vas a poder asistir. ¡Gracias por el saludo!'
			});
			setForm(emptyRsvpForm);
			setRsvpModalOpen(false);
			onSuccess?.({ stats: data.stats, guests: data.guests, attending, hasMessage });
		} catch (cause) {
			setStatus({ type: 'error', message: cause instanceof Error ? cause.message : 'No pudimos guardar tu pase.' });
		} finally {
			setSaving(false);
		}
	}

	return {
		form,
		status,
		setStatus,
		saving,
		rsvpModalOpen,
		setRsvpModalOpen,
		updateForm,
		openRsvpModal,
		submitRsvp
	};
}
