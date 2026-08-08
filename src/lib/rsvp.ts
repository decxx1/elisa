export type RsvpForm = {
	name: string;
	attending: boolean;
	message: string;
};

export type RsvpStatus = {
	type: 'idle' | 'success' | 'error';
	message: string;
};

export const emptyRsvpForm: RsvpForm = { name: '', attending: true, message: '' };
