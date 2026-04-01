import { useState } from 'react';
import { Icons } from '../icons';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

interface NavItemProps {
	item: {
		id: string;
		label: string;
		icon: string;
		link: string;
	};
	active: string;
	collapsed: boolean;
	onClick: (id: string) => void;
}

const NavItem = ({ item, collapsed }: NavItemProps) => {
	const { pathname } = useLocation();
	const [hovered, setHovered] = useState(false);
	const isActive = pathname === item.link;

	return (
		<div className='relative'>
			<NavLink
				to={item.link}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				title={collapsed ? item.label : ''}
				className={[
					'w-full flex items-center gap-3 px-3 py-2.5',
					'border-none rounded-xl cursor-pointer',
					'overflow-hidden whitespace-nowrap relative',
					'transition-[background,color] duration-[180ms]',
					isActive
						? 'bg-primary/20 text-primary'
						: hovered
							? 'bg-primary/20 text-primary'
							: 'bg-transparent text-gray-400 dark:text-white/[0.38]',
				].join(' ')}>
				{/* active indicator bar */}
				{isActive && (
					<div className='absolute left-0 top-[20%] bottom-[20%] w-[3px] rounded-full bg-primary shadow-[0_0_8px_0_rgba(0, 179, 255, 0.7)]' />
				)}

				<span
					className={`flex-shrink-0 transition-[margin] duration-[180ms] ${isActive ? 'ml-1' : 'ml-0'}`}>
					{(() => {
						const IconComponent = Icons[item.icon as keyof typeof Icons];
						return IconComponent ? (
							<IconComponent size={18} />
						) : (
							<div className='w-4' />
						);
					})()}
				</span>

				<span
					className={[
						"text-sm font-['DM_Sans',sans-serif]",
						'overflow-hidden transition-[max-width,opacity]',
						'duration-300 ease-in-out',
						isActive ? 'font-semibold' : 'font-normal',
						collapsed ? 'max-w-0 opacity-0' : 'max-w-[140px] opacity-100',
					].join(' ')}>
					{item.label}
				</span>
			</NavLink>

			{/* collapsed tooltip */}
			{collapsed && hovered && (
				<div className='absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-[#1e1e2e] border border-primary/20 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap z-[100] pointer-events-none shadow-[0_4px_16px_rgba(0,0,0,0.4)]'>
					{item.label}
				</div>
			)}
		</div>
	);
};

export default NavItem;
