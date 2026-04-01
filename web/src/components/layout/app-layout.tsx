import { Outlet } from 'react-router-dom';

import Header from './header';
import Sidebar from './sidebar';

import { useState } from 'react';

const AppLayout = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [activeNav, setActiveNav] = useState('today');

	return (
		<>
			<div className="flex min-h-screen font-['DM_Sans',sans-serif]">
				<Sidebar
					collapsed={collapsed}
					onToggle={() => setCollapsed(c => !c)}
					activeNav={activeNav}
					onNav={setActiveNav}
				/>

				{/* main column */}
				<div className='flex flex-1 flex-col min-w-0 overflow-hidden'>
					<Header activeNav={activeNav} />

					{/* page content slot */}
					<main className='flex flex-1 items-center justify-center p-8'>
						<Outlet />
					</main>
				</div>
			</div>
		</>
	);
};
export default AppLayout;
