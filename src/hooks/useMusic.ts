import { useEffect, useRef, useState } from 'react';

export function useMusic(src = '/sounds/glenn-miller-In-the-mood.m4a') {
	const [musicPlaying, setMusicPlaying] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	function startMusic() {
		const audio = audioRef.current ?? new Audio(src);
		audio.loop = true;
		audio.volume = 0.5;
		audioRef.current = audio;
		void audio.play().then(() => setMusicPlaying(true)).catch(() => setMusicPlaying(false));
	}

	function stopMusic() {
		const audio = audioRef.current;
		if (audio) {
			audio.pause();
			audio.currentTime = 0;
		}
		setMusicPlaying(false);
	}

	function toggleMusic() {
		if (musicPlaying) stopMusic();
		else startMusic();
	}

	useEffect(() => () => stopMusic(), []);

	return { musicPlaying, toggleMusic };
}
