import { useEffect, useState } from 'react';
import { getCountdownState, type CountdownState } from '@/lib/event';

export function useCountdown() {
	const [countdownState, setCountdownState] = useState<CountdownState | null>(null);

	useEffect(() => {
		setCountdownState(getCountdownState());
		const timer = window.setInterval(() => setCountdownState(getCountdownState()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	return countdownState;
}
