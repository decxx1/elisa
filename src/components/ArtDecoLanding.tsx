import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, useState } from 'react';
import MobileTabBar from '@/components/MobileTabBar';
import DesktopQuickActions from '@/components/overlays/DesktopQuickActions';
import DateModal from '@/components/overlays/DateModal';
import GuestbookModal from '@/components/overlays/GuestbookModal';
import GuestbookPanel from '@/components/overlays/GuestbookPanel';
import LocationModal from '@/components/overlays/LocationModal';
import RsvpModal from '@/components/overlays/RsvpModal';
import ContrasenaSection from '@/components/sections/ContrasenaSection';
import GaleriaSection from '@/components/sections/GaleriaSection';
import HeroSection from '@/components/sections/HeroSection';
import HistoriaSection from '@/components/sections/HistoriaSection';
import LugarSection from '@/components/sections/LugarSection';
import ProgramaSection from '@/components/sections/ProgramaSection';
import RsvpSection from '@/components/sections/RsvpSection';
import VestimentaSection from '@/components/sections/VestimentaSection';
import SiteHeader from '@/components/SiteHeader';
import { useGuestbook } from '@/hooks/useGuestbook';
import { useMusic } from '@/hooks/useMusic';
import { useRsvp } from '@/hooks/useRsvp';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ArtDecoLanding() {
	const rootRef = useRef<HTMLDivElement>(null);
	const [locationModalOpen, setLocationModalOpen] = useState(false);
	const [dateModalOpen, setDateModalOpen] = useState(false);
	const { musicPlaying, toggleMusic } = useMusic();
	const {
		stats,
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
		openGuestbookModal,
		toggleGuestbook,
		applyGuestbookData
	} = useGuestbook();
	const {
		form,
		status,
		saving,
		rsvpModalOpen,
		setRsvpModalOpen,
		updateForm,
		openRsvpModal,
		submitRsvp
	} = useRsvp({
		onSuccess: ({ stats: nextStats, guests: nextGuests, attending, hasMessage }) => {
			applyGuestbookData({ stats: nextStats, guests: nextGuests });
			if (attending || hasMessage) setGuestbookOpen(true);
		}
	});

	useEffect(() => {
		if (!guestbookOpen && !guestbookModalOpen && !rsvpModalOpen && !locationModalOpen && !dateModalOpen) return;
		function onKey(event: KeyboardEvent) {
			if (event.key !== 'Escape') return;
			if (rsvpModalOpen) setRsvpModalOpen(false);
			else if (locationModalOpen) setLocationModalOpen(false);
			else if (dateModalOpen) setDateModalOpen(false);
			else if (guestbookModalOpen) setGuestbookModalOpen(false);
			else setGuestbookOpen(false);
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [guestbookOpen, guestbookModalOpen, rsvpModalOpen, locationModalOpen, dateModalOpen, setGuestbookOpen, setGuestbookModalOpen, setRsvpModalOpen]);

	useEffect(() => {
		if (!guestbookModalOpen && !rsvpModalOpen && !locationModalOpen && !dateModalOpen) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	}, [guestbookModalOpen, rsvpModalOpen, locationModalOpen, dateModalOpen]);

	useGSAP(() => {
		const media = gsap.matchMedia();
		media.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.from('.hero-copy > *', {
				opacity: 0,
				y: 26,
				stagger: 0.12,
				duration: 0.9,
				ease: 'power3.out'
			});
			gsap.from('.hero-art', { opacity: 0, scale: 1.08, duration: 1.5, ease: 'power2.out' });
			gsap.to('.hero-art', {
				yPercent: 8,
				ease: 'none',
				scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true }
			});
			gsap.to('.ornament-float', {
				yPercent: -20,
				ease: 'none',
				scrollTrigger: { trigger: '.hero-section', start: 'top bottom', end: 'bottom top', scrub: true }
			});
			gsap.to('.scroll-progress', {
				scaleX: 1,
				ease: 'none',
				transformOrigin: 'left center',
				scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.3 }
			});
			ScrollTrigger.batch('.reveal', {
				start: 'top 88%',
				onEnter: (elements) =>
					gsap.from(elements, {
						opacity: 0,
						y: 34,
						stagger: 0.08,
						duration: 0.8,
						ease: 'power3.out'
					})
			});
		});

		return () => media.revert();
	}, { scope: rootRef });

	return (
		<div className="min-h-screen overflow-hidden bg-ink pb-20 text-ivory selection:bg-gold selection:text-ink lg:pb-0" ref={rootRef}>
			<div className="scroll-progress" />
			<SiteHeader musicPlaying={musicPlaying} onToggleMusic={toggleMusic} />

			<main>
				<HeroSection />
				<HistoriaSection />
				<VestimentaSection />
				<ProgramaSection />
				<ContrasenaSection />
				<RsvpSection
					confirmed={stats.confirmed}
					form={form}
					status={status}
					saving={saving}
					onUpdate={updateForm}
					onSubmit={submitRsvp}
				/>
				<LugarSection />
				<GaleriaSection />
			</main>

			<div className="pointer-events-none fixed inset-x-4 bottom-[4.75rem] z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:bottom-5 sm:right-5 lg:bottom-7 lg:right-7">
				{guestbookOpen && (
					<GuestbookPanel
						statsConfirmed={stats.confirmed}
						guests={guests}
						visibleGuests={visibleGuests}
						activeGuestId={activeGuestId}
						guestbookFilter={guestbookFilter}
						guestbookSort={guestbookSort}
						onCycleFilter={() =>
							setGuestbookFilter((current) => (current === 'all' ? 'confirmed' : current === 'confirmed' ? 'declined' : 'all'))
						}
						onToggleSort={() => setGuestbookSort((current) => (current === 'newest' ? 'oldest' : 'newest'))}
						onExpand={openGuestbookModal}
						onClose={() => setGuestbookOpen(false)}
					/>
				)}
				<DesktopQuickActions
					guestbookOpen={guestbookOpen}
					guestCount={guests.length}
					onOpenLocation={() => setLocationModalOpen(true)}
					onToggleGuestbook={toggleGuestbook}
				/>
			</div>

			<MobileTabBar
				guestbookOpen={guestbookOpen}
				guestCount={guests.length}
				onOpenLocation={() => setLocationModalOpen(true)}
				onOpenRsvp={openRsvpModal}
				onToggleGuestbook={toggleGuestbook}
				onOpenDate={() => setDateModalOpen(true)}
			/>

			{locationModalOpen && <LocationModal onClose={() => setLocationModalOpen(false)} />}
			{dateModalOpen && <DateModal onClose={() => setDateModalOpen(false)} />}

			{guestbookModalOpen && (
				<GuestbookModal
					statsConfirmed={stats.confirmed}
					guests={guests}
					visibleGuests={visibleGuests}
					activeGuestId={activeGuestId}
					guestbookFilter={guestbookFilter}
					guestbookSort={guestbookSort}
					onFilterChange={setGuestbookFilter}
					onSortChange={setGuestbookSort}
					onSelectGuest={setActiveGuestId}
					onOpenRsvp={openRsvpModal}
					onClose={() => setGuestbookModalOpen(false)}
				/>
			)}

			{rsvpModalOpen && (
				<RsvpModal
					form={form}
					status={status}
					saving={saving}
					onUpdate={updateForm}
					onSubmit={submitRsvp}
					onClose={() => setRsvpModalOpen(false)}
				/>
			)}
		</div>
	);
}
