import {
	Bell,
	ChartColumn,
	Clock,
	Search,
	Settings,
	History,
	ChevronLeft,
	Goal,
} from 'lucide-react';

export const Icons = {
	search: Search,
	bell: Bell,
	clock: Clock,
	history: History,
	stats: ChartColumn,
	settings: Settings,
	chevronLeft: ChevronLeft,
	goal: Goal,
};

export type IconType = keyof typeof Icons;
