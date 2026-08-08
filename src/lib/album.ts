export type AlbumPhoto = {
	id: number;
	thumb: string;
	src: string;
	alt: string;
};

/** Fotos disponibles del álbum. Se omite la 5 porque no hay archivo. */
const albumFiles = [
	[1, 'png'],
	[2, 'png'],
	[3, 'png'],
	[4, 'png'],
	[6, 'png'],
	[7, 'png'],
	[8, 'png'],
	[9, 'png'],
	[10, 'png'],
	[11, 'png'],
	[12, 'jpg'],
	[13, 'jpg'],
	[14, 'jpg'],
	[15, 'jpg'],
	[16, 'jpeg'],
	[17, 'jpeg']
] as const;

export const albumPhotos: AlbumPhoto[] = albumFiles.map(([id, extension]) => ({
	id,
	thumb: `/images/album/thumb/${id}.webp`,
	src: `/images/album/${id}.${extension}`,
	alt: `Recuerdo del álbum · foto ${id}`
}));
