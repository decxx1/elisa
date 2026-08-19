import { useCallback, useEffect, useState } from 'react';
import {
	getVisibleGuests,
	type GuestbookFilter,
	type GuestbookSort,
	type GuestNote
} from '@/lib/guestbook';

export function useGuestbook() {
	const [stats, setStats] = useState({ total: 0, confirmed: 0 });
	const [rsvpOpen, setRsvpOpen] = useState(true);
	const [guests, setGuests] = useState<GuestNote[]>([]);
	const [guestbookOpen, setGuestbookOpen] = useState(false);
	const [guestbookModalOpen, setGuestbookModalOpen] = useState(false);
	const [guestbookFilter, setGuestbookFilter] = useState<GuestbookFilter>('all');
	const [guestbookSort, setGuestbookSort] = useState<GuestbookSort>('newest');
	const [activeGuestId, setActiveGuestId] = useState<number | null>(null);

	const visibleGuests = getVisibleGuests(guests, guestbookFilter, guestbookSort);

	const loadGuestbook = useCallback(async () => {
		try {
			const response = await fetch('/api/rsvp');
			const data = await response.json();
			setStats({ total: data.total ?? 0, confirmed: data.confirmed ?? 0 });
			setRsvpOpen(data.rsvpOpen !== false);
			setGuests(Array.isArray(data.guests) ? data.guests : []);
		} catch {
			/* ignore network errors while idle */
		}
	}, []);

	useEffect(() => {
		void loadGuestbook();
		const refresh = window.setInterval(() => void loadGuestbook(), 45_000);
		return () => window.clearInterval(refresh);
	}, [loadGuestbook]);

	useEffect(() => {
		const list = getVisibleGuests(guests, guestbookFilter, guestbookSort);
		if (!list.length) {
			setActiveGuestId(null);
			return;
		}
		if (activeGuestId == null || !list.some((guest) => guest.id === activeGuestId)) {
			setActiveGuestId(list[0].id);
		}
	}, [guests, guestbookFilter, guestbookSort, activeGuestId]);

	useEffect(() => {
		if (!guestbookOpen || guestbookModalOpen) return;
		const list = getVisibleGuests(guests, guestbookFilter, guestbookSort);
		if (list.length < 2) return;
		const rotate = window.setInterval(() => {
			setActiveGuestId((current) => {
				const index = list.findIndex((guest) => guest.id === current);
				const next = list[(index + 1) % list.length];
				return next?.id ?? list[0].id;
			});
		}, 4500);
		return () => window.clearInterval(rotate);
	}, [guestbookOpen, guestbookModalOpen, guests, guestbookFilter, guestbookSort]);

	useEffect(() => {
		if (!guestbookOpen || activeGuestId == null) return;
		document.querySelector(`[data-guest-id="${activeGuestId}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	}, [activeGuestId, guestbookOpen]);

	function openGuestbookModal(guestId?: number) {
		if (guestId != null) setActiveGuestId(guestId);
		setGuestbookModalOpen(true);
		void loadGuestbook();
	}

	function toggleGuestbook() {
		if (guestbookOpen) {
			setGuestbookOpen(false);
			return;
		}
		setGuestbookOpen(true);
		void loadGuestbook();
	}

	const applyGuestbookData = useCallback(
		(data: { stats?: { total: number; confirmed: number }; guests?: GuestNote[] }) => {
			if (data.stats) setStats(data.stats);
			if (Array.isArray(data.guests)) setGuests(data.guests);
			else void loadGuestbook();
		},
		[loadGuestbook]
	);

	return {
		stats,
		rsvpOpen,
		guests,
		visibleGuests,
		guestbookOpen,
		setGuestbookOpen,
		guestbookModalOpen,
		setGuestbookModalOpen,
		guestbookFilter,
		setGuestbookFilter,
		guestbookSort,
		setGuestbookSort,
		activeGuestId,
		setActiveGuestId,
		loadGuestbook,
		openGuestbookModal,
		toggleGuestbook,
		applyGuestbookData
	};
}
