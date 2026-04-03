export const NAV_ITEMS = [
	{ id: 'today', label: 'Today', icon: 'clock', link: '/today' },
	{ id: 'history', label: 'History', icon: 'history', link: '/history' },
	{ id: 'stats', label: 'Stats', icon: 'stats', link: '/stats' },
	{ id: 'goals', label: 'Goals', icon: 'goal', link: '/goals' },
	{ id: 'settings', label: 'Settings', icon: 'settings', link: '/settings' },
];

export const API_URL = import.meta.env.VITE_API_URL as string;

export const PAGE_SIZE = 10;
