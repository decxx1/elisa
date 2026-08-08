export type AlbumPhoto = {
	id: number;
	thumb: string;
	src: string;
	alt: string;
};

/** Pares thumb.webp → original.png (sin 5: no hay archivo). */
export const albumPhotos: AlbumPhoto[] = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11].map((id) => ({
	id,
	thumb: `/images/album/thumb/${id}.webp`,
	src: `/images/album/${id}.png`,
	alt: `Recuerdo del álbum · foto ${id}`
}));
