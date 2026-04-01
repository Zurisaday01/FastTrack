import { Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';

const ModeToggle = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<Button
			variant='secondary'
			size='icon'
			className='group/toggle size-8 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30'
			onClick={toggleTheme}>
			{theme === 'dark' ? <Moon /> : <Sun />}
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
};
export default ModeToggle;
