import { NAV_ITEMS } from '../../lib/constants';
import { Icons } from '../icons';

import Logo from '../logo';
import NavItem from './nav-item';

interface SidebarProps {
	collapsed: boolean;
	onToggle: () => void;
	activeNav: string;
	onNav: (id: string) => void;
}

const Sidebar = ({ collapsed, onToggle, activeNav, onNav }: SidebarProps) => {
	return (
		<aside
			className={`
				${collapsed ? 'w-[68px]' : 'w-[220px]'}
				min-h-screen border-r border-primary/30 flex flex-col
				transition-[width] duration-300 ease-[cubic-bezier(.4,0,.2,1)]
				overflow-hidden shrink-0 relative z-20
			`}>
			{/* logo + toggle row */}
			<div
				className={`
					flex items-center gap-2 px-3.5 pt-5 pb-4
					border-b border-white/[0.05]
					${collapsed ? 'justify-center' : 'justify-between'}
				`}>
				<Logo collapsed={collapsed} />

				<button
					onClick={onToggle}
					className='
						group shrink-0 w-7 h-7 flex items-center justify-center
						border border-primary/20 rounded-lg cursor-pointer
						bg-primary/20 hover:bg-primary/30
						text-primary
						transition-[background,color] duration-200
					'>
					<div
						className={`flex transition-transform duration-300 ease-in-out ${collapsed ? 'rotate-180' : 'rotate-0'}`}>
						<Icons.chevronLeft size={14} />
					</div>
				</button>
			</div>

			{/* nav */}
			<nav className='flex-1 flex flex-col gap-0.5 px-2 py-3.5'>
				{NAV_ITEMS.map(item => (
					<NavItem
						key={item.id}
						item={item}
						active={activeNav}
						collapsed={collapsed}
						onClick={onNav}
					/>
				))}
			</nav>

			{/* user section */}
			<div className='px-2 py-3.5 border-t border-white/[0.05]'>
				<div
					className='
						flex items-center gap-2.5 px-3 py-2.5
						rounded-xl overflow-hidden cursor-pointer
						hover:bg-white/5 transition-[background] duration-[180ms]
					'>
					<div
						className="
							shrink-0 w-8 h-8 rounded-full flex items-center justify-center
							bg-gradient-to-br from-primary to-primary-dark
							text-xs font-bold font-['DM_Sans',sans-serif]
						">
						A
					</div>

					<div
						className={`
							overflow-hidden whitespace-nowrap
							transition-[max-width,opacity] duration-300 ease-in-out
							${collapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}
						`}>
						<p className="m-0 text-[13px] font-semibold font-['DM_Sans',sans-serif]">
							Alex Rivera
						</p>
						<p className="m-0 text-[11px] text-gray-400 dark:text-white/[0.35] font-['DM_Sans',sans-serif]">
							OMAD · 7d streak
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
