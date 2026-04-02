import { NAV_ITEMS } from '../../lib/constants';
import ModeToggle from '../mode-toggle';

import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import UserAvatar from '../auth/user-avatar';

interface HeaderProps {
	activeNav: string;
}

const Header = ({ activeNav }: HeaderProps) => {
	const label = NAV_ITEMS.find(n => n.id === activeNav)?.label ?? 'Dashboard';

	return (
		<header className='h-15  backdrop-blur-lg border-b border-primary/30 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0'>
			{/* page title */}
			<h1 className='leading-2'>{label}</h1>

			{/* right controls */}
			<div className='flex items-center gap-3'>
				{/* search */}
				<Button
					variant='ghost'
					className='bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30'>
					<Icons.search size={16} />
				</Button>

				{/* notifications */}
				<Button
					variant='ghost'
					className='bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 relative'>
					<Icons.bell size={16} />
					<span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-lg' />
				</Button>

				{/* divider */}

				<Separator orientation='vertical' className='bg-primary/30 h-8' />

				<ModeToggle />

				{/* avatar */}
				<UserAvatar/>
			</div>
		</header>
	);
};

export default Header;
