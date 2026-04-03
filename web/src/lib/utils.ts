import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const to12Hour = (time: string) => {
	const [h, m, s] = time.split(':').map(Number);
	const period = h >= 12 ? 'PM' : 'AM';
	const hour = h % 12 || 12;
	return `${hour}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${period}`;
};

export const formatTime = (time: string) => {
	const date = new Date(time);
	const h = date.getUTCHours();
	const m = date.getUTCMinutes();
	const period = h >= 12 ? 'PM' : 'AM';
	const hour = h % 12 || 12;
	return `${hour}:${String(m).padStart(2, '0')} ${period}`;
};
