export type GuestNote = {
	id: number;
	name: string;
	message: string | null;
	attending: boolean;
	createdAt: string;
};

export type GuestbookFilter = 'all' | 'confirmed' | 'declined';
export type GuestbookSort = 'newest' | 'oldest';

export type AttireLightbox = {
	src: string;
	alt: string;
	label: string;
	detail: string;
};

export const attireLooks: AttireLightbox[] = [
	{
		src: '/images/art-deco-woman-attire.webp',
		alt: 'Ejemplo de vestimenta Art Déco para mujer: vestido con flecos, perlas y tocado',
		label: 'Ella',
		detail: 'Flapper · 1924'
	},
	{
		src: '/images/art-deco-man-attire.webp',
		alt: 'Ejemplo de vestimenta Art Déco para hombre: traje claro, corbata y fedora',
		label: 'Él',
		detail: 'Caballero · 1924'
	}
];

export const NAME_MAX = 35;
export const MESSAGE_MAX = 550;

export function getVisibleGuests(guests: GuestNote[], filter: GuestbookFilter, sort: GuestbookSort) {
	const filtered = guests.filter((guest) => {
		const attending = Boolean(guest.attending);
		if (filter === 'confirmed') return attending;
		if (filter === 'declined') return !attending;
		return true;
	});

	return filtered.slice().sort((a, b) => {
		const left = new Date(a.createdAt).getTime();
		const right = new Date(b.createdAt).getTime();
		return sort === 'newest' ? right - left : left - right;
	});
}
