import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

// ── helpers ───────────────────────────────────────────────────────────────────
const pad = (n: number) => String(n).padStart(2, '0');

const formatDuration = (totalSeconds: number) => {
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const formatHours = (totalSeconds: number) =>
	`${(totalSeconds / 3600).toFixed(1)}h`;

// ── mock data ─────────────────────────────────────────────────────────────────
const MOCK_HISTORY = [
	{ date: 'Mon Mar 24', hours: 16.5, goal: 16, completed: true },
	{ date: 'Tue Mar 25', hours: 18.2, goal: 16, completed: true },
	{ date: 'Wed Mar 26', hours: 14.1, goal: 16, completed: false },
	{ date: 'Thu Mar 20', hours: 16.0, goal: 16, completed: true },
	{ date: 'Fri Mar 21', hours: 17.4, goal: 16, completed: true },
	{ date: 'Sat Mar 22', hours: 20.0, goal: 16, completed: true },
	{ date: 'Sun Mar 23', hours: 15.8, goal: 16, completed: false },
];

const GOAL_HOURS = 16;
const GOAL_SECONDS = GOAL_HOURS * 3600;
const FAST_START_SECONDS = 8 * 3600;

// ── RingTimer ─────────────────────────────────────────────────────────────────
const RingTimer = ({ elapsed, goal }: { elapsed: number; goal: number }) => {
	const pct = Math.min(elapsed / goal, 1);
	const radius = 88;
	const circ = 2 * Math.PI * radius;
	const dash = pct * circ;
	const isComplete = pct >= 1;

	return (
		<div className='relative w-[220px] h-[220px] mx-auto'>
			<svg
				width='220'
				height='220'
				viewBox='0 0 220 220'
				className='-rotate-90'>
				{/* track — lighter in light mode, darker in dark */}
				<circle
					cx='110'
					cy='110'
					r={radius}
					fill='none'
					className='stroke-black/10 dark:stroke-white/[0.06]'
					strokeWidth='10'
				/>
				<circle
					cx='110'
					cy='110'
					r={radius}
					fill='none'
					stroke={isComplete ? '#34D399' : 'var(--primary)'}
					strokeWidth='10'
					strokeDasharray={`${dash} ${circ}`}
					strokeLinecap='round'
					style={{
						filter: `drop-shadow(0 0 10px ${isComplete ? 'rgba(52,211,153,0.5)' : 'rgba(0, 179, 255, 0.7)'})`,
						transition: 'stroke-dasharray 0.8s cubic-bezier(.4,0,.2,1), stroke 0.4s',
					}}
				/>
				{Array.from({ length: 24 }).map((_, i) => {
					const angle = (i / 24) * 2 * Math.PI;
					const x1 = 110 + 96 * Math.cos(angle);
					const y1 = 110 + 96 * Math.sin(angle);
					const x2 = 110 + 100 * Math.cos(angle);
					const y2 = 110 + 100 * Math.sin(angle);
					return (
						<line
							key={i}
							x1={x1} y1={y1} x2={x2} y2={y2}
							stroke='currentColor'
							className='text-black/10 dark:text-white/[0.12]'
							strokeWidth='1.5'
						/>
					);
				})}
			</svg>

			<div className='absolute inset-0 flex flex-col items-center justify-center gap-[2px]'>
				<span className='text-[11px] tracking-[0.12em] text-neutral-400 dark:text-white/35 uppercase'>
					{isComplete ? 'Goal reached' : 'Fasting'}
				</span>
				<span
					className='text-[36px] font-bold leading-none tracking-[-0.02em] font-mono text-neutral-900 dark:text-white'
					style={{ color: isComplete ? '#34D399' : undefined }}>
					{formatDuration(elapsed)}
				</span>
				<span className='text-[12px] text-neutral-400 dark:text-white/30'>
					goal {GOAL_HOURS}:00:00
				</span>
			</div>
		</div>
	);
};

// ── StatCard ──────────────────────────────────────────────────────────────────
const StatCard = ({
	label,
	value,
	sub,
	accent,
}: {
	label: string;
	value: string;
	sub?: string;
	accent?: string;
}) => (
	<div className='bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl px-5 py-[18px] flex-1'>
		<p className='text-[11px] text-neutral-400 dark:text-white/35 uppercase tracking-[0.08em] mb-1.5'>
			{label}
		</p>
		<p
			className='text-[22px] font-bold font-mono leading-none text-neutral-900 dark:text-white'
			style={{ color: accent }}>
			{value}
		</p>
		{sub && <p className='text-[12px] text-neutral-400 dark:text-white/30 mt-1'>{sub}</p>}
	</div>
);

// ── HistoryBar ────────────────────────────────────────────────────────────────
const HistoryBar = ({ entry }: { entry: (typeof MOCK_HISTORY)[0] }) => {
	const pct = Math.min((entry.hours / (GOAL_HOURS + 4)) * 100, 100);
	const goalPct = (GOAL_HOURS / (GOAL_HOURS + 4)) * 100;

	return (
		<div className='flex items-center gap-3 py-2.5 border-b border-black/[0.06] dark:border-white/[0.05]'>
			<span className='text-[12px] text-neutral-400 dark:text-white/35 w-20 shrink-0'>
				{entry.date}
			</span>
			<div className='flex-1 relative h-[6px] bg-black/[0.07] dark:bg-white/[0.06] rounded-full'>
				<div
					className='absolute top-[-4px] bottom-[-4px] w-px bg-black/20 dark:bg-white/20'
					style={{ left: `${goalPct}%` }}
				/>
				<div
					className='h-full rounded-full transition-[width] duration-[600ms]'
					style={{
						width: `${pct}%`,
						background: entry.completed
							? 'linear-gradient(90deg, var(--primary), var(--primary-light, #9B8FFF))'
							: 'rgba(108,99,255,0.35)',
					}}
				/>
			</div>
			<span
				className='text-[12px] font-mono w-9 text-right shrink-0'
				style={{ color: entry.completed ? 'var(--primary)' : undefined }}
				>
				<span className={cn(!entry.completed && 'text-neutral-300 dark:text-white/30')}>
					{entry.hours}h
				</span>
			</span>
		</div>
	);
};

// ── Today ─────────────────────────────────────────────────────────────────────
const Today = () => {
	const [elapsed, setElapsed] = useState(FAST_START_SECONDS);
	const [running, setRunning] = useState(true);
	const [nav, setNav] = useState('home');
	const [showEndModal, setShowEndModal] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (running) {
			intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
		}
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [running]);

	const pct = Math.min((elapsed / GOAL_SECONDS) * 100, 100);
	const streak = MOCK_HISTORY.filter(d => d.completed).length;
	const avgHours = (
		MOCK_HISTORY.reduce((a, d) => a + d.hours, 0) / MOCK_HISTORY.length
	).toFixed(1);
	const now = new Date();
	const startTime = new Date(now.getTime() - elapsed * 1000);
	const startStr = `${pad(startTime.getHours())}:${pad(startTime.getMinutes())}`;

	return (
		<div className='w-full'>
			{/* bg glows — subtle in light, vivid in dark */}
			<div className='fixed inset-0 pointer-events-none z-0'>
				<div className='absolute -top-[120px] -left-[80px] w-[500px] h-[500px] rounded-full blur-[40px] bg-[radial-gradient(circle,rgba(0,179,255,0.07),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(0,179,255,0.18),transparent_70%)]' />
				<div className='absolute -bottom-[80px] -right-[80px] w-[400px] h-[400px] rounded-full blur-[40px] bg-[radial-gradient(circle,rgba(59,47,143,0.07),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(59,47,143,0.2),transparent_70%)]' />
			</div>

			<div className='min-h-screen flex flex-col relative overflow-hidden'>
				<div className='flex-1 overflow-y-auto px-6 pt-6 pb-[100px] relative z-10'>

					{/* ── HOME ── */}
					{nav === 'home' && (
						<>
							<div className='mb-7'>
								<h2 className='text-[24px] font-bold tracking-[-0.02em] mb-1 text-neutral-900 dark:text-white'>
									{elapsed >= GOAL_SECONDS ? 'Goal smashed 🎉' : 'Keep going, Alex'}
								</h2>
								<p className='text-[14px] text-neutral-500 dark:text-white/40'>
									Started at {startStr} · {pct.toFixed(0)}% of goal
								</p>
							</div>

							{/* ring timer card */}
							<div className='bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-3xl px-6 pt-8 pb-7 mb-4 text-center'>
								<RingTimer elapsed={elapsed} goal={GOAL_SECONDS} />

								<div className='mt-7 flex gap-2.5 justify-center'>
									<button
										onClick={() => setRunning(r => !r)}
										className={cn(
											'px-7 py-3 rounded-xl text-[14px] font-semibold border cursor-pointer transition-all duration-200 text-neutral-800 dark:text-white',
											running
												? 'bg-black/[0.06] dark:bg-white/[0.08] border-black/10 dark:border-white/10'
												: 'border-transparent text-white'
										)}
										style={!running ? {
											background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
										} : undefined}>
										{running ? '⏸ Pause' : '▶ Resume'}
									</button>
									<button
										onClick={() => setShowEndModal(true)}
										className='px-7 py-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-[14px] font-semibold cursor-pointer transition-all duration-200'>
										End Fast
									</button>
								</div>
							</div>

							{/* stat cards */}
							<div className='flex gap-2.5 mb-4'>
								<StatCard label='Streak' value={`${streak}d`} sub='days in a row' accent='#F59E0B' />
								<StatCard label='Avg fast' value={`${avgHours}h`} sub='this week' accent='var(--primary)' />
							</div>
							<div className='flex gap-2.5 mb-6'>
								<StatCard label='Goal' value={`${GOAL_HOURS}h`} sub='OMAD target' />
								<StatCard
									label='Today'
									value={formatHours(elapsed)}
									sub={elapsed >= GOAL_SECONDS ? '✓ Complete' : 'in progress'}
									accent={elapsed >= GOAL_SECONDS ? '#34D399' : undefined}
								/>
							</div>

							{/* fasting phases */}
							<div className='bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl px-5 py-4 mb-2'>
								<p className='text-[11px] text-neutral-400 dark:text-white/35 uppercase tracking-[0.08em] mb-3'>
									Fasting phases
								</p>
								{[
									{ label: 'Fed state',          range: '0–4h',   active: elapsed < 4 * 3600 },
									{ label: 'Glycogen depletion', range: '4–12h',  active: elapsed >= 4 * 3600 && elapsed < 12 * 3600 },
									{ label: 'Fat burning',        range: '12–18h', active: elapsed >= 12 * 3600 && elapsed < 18 * 3600 },
									{ label: 'Deep ketosis',       range: '18h+',   active: elapsed >= 18 * 3600 },
								].map((phase, i) => (
									<div key={i} className='flex items-center gap-2.5 py-1.5'>
										<div
											className='w-2 h-2 rounded-full shrink-0 transition-all duration-[400ms]'
											style={{
												background: phase.active ? 'var(--primary)' : undefined,
												boxShadow: phase.active ? '0 0 8px rgba(0, 179, 255, 0.7)' : 'none',
											}}
											// inactive dot uses Tailwind so it adapts to theme
											{...(phase.active ? {} : { className: 'w-2 h-2 rounded-full shrink-0 bg-black/15 dark:bg-white/[0.12] transition-all duration-[400ms]' })}
										/>
										<span className={cn(
											'text-[14px] font-medium flex-1 transition-colors duration-[400ms]',
											phase.active
												? 'text-neutral-900 dark:text-white'
												: 'text-neutral-400 dark:text-white/30',
										)}>
											{phase.label}
										</span>
										<span className='text-[12px] font-mono text-neutral-400 dark:text-white/25'>
											{phase.range}
										</span>
									</div>
								))}
							</div>
						</>
					)}

					{/* ── HISTORY ── */}
					{nav === 'history' && (
						<>
							<div className='mb-6'>
								<h2 className='text-[24px] font-bold tracking-[-0.02em] mb-1 text-neutral-900 dark:text-white'>
									History
								</h2>
								<p className='text-[14px] text-neutral-500 dark:text-white/40'>
									Your recent fasting sessions
								</p>
							</div>

							<div className='bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-2xl px-5 py-4 mb-4'>
								<div className='flex justify-between mb-2'>
									<span className='text-[11px] text-neutral-400 dark:text-white/35 uppercase tracking-[0.08em]'>
										Past 7 days
									</span>
									<div className='flex gap-3 text-[11px]'>
										<span className='text-primary'>■ Goal met</span>
										<span className='text-primary/50'>■ Partial</span>
									</div>
								</div>
								{MOCK_HISTORY.map((entry, i) => (
									<HistoryBar key={i} entry={entry} />
								))}
							</div>

							<div className='flex gap-2.5'>
								<StatCard label='Best fast' value='20.0h' sub='Sat Mar 22' accent='#34D399' />
								<StatCard label='Goal rate' value='71%' sub='5 of 7 days' accent='var(--primary)' />
							</div>
						</>
					)}

					{/* ── SETTINGS ── */}
					{nav === 'settings' && (
						<>
							<div className='mb-6'>
								<h2 className='text-[24px] font-bold tracking-[-0.02em] mb-1 text-neutral-900 dark:text-white'>
									Settings
								</h2>
								<p className='text-[14px] text-neutral-500 dark:text-white/40'>
									Customize your fasting schedule
								</p>
							</div>

							{[
								{ label: 'Fast start time', value: '20:00' },
								{ label: 'Daily goal (hours)', value: '16' },
								{ label: 'Reminder before goal', value: '30 min' },
							].map((item, i) => (
								<div
									key={i}
									className='bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.07] dark:border-white/[0.07] rounded-[14px] px-5 py-4 mb-2.5 flex justify-between items-center'>
									<span className='text-[14px] text-neutral-700 dark:text-white/70'>
										{item.label}
									</span>
									<span className='text-[14px] font-mono text-primary'>
										{item.value}
									</span>
								</div>
							))}

							<div className='bg-red-500/[0.06] border border-red-500/[0.18] rounded-[14px] px-5 py-4 mt-6 cursor-pointer text-center hover:bg-red-500/10 transition-colors duration-200'>
								<span className='text-[14px] text-red-400 font-medium'>Sign out</span>
							</div>
						</>
					)}
				</div>
			</div>

			{/* end fast modal */}
			{showEndModal && (
				<div className='fixed inset-0 z-50 bg-black/40 dark:bg-black/70 backdrop-blur-[8px] flex items-end justify-center p-6'>
					<div className='w-full max-w-[420px] bg-white dark:bg-[#181825] border border-black/10 dark:border-white/10 rounded-3xl p-7 shadow-xl'>
						<h3 className='text-[20px] font-bold mb-2 text-neutral-900 dark:text-white'>
							End your fast?
						</h3>
						<p className='text-[14px] text-neutral-500 dark:text-white/50'>
							You've fasted for{' '}
							<strong className='text-primary'>{formatHours(elapsed)}</strong>
							{elapsed >= GOAL_SECONDS
								? ' — goal achieved! 🎉'
								: ` — ${((elapsed / GOAL_SECONDS) * 100).toFixed(0)}% of your goal.`}
						</p>
						<div className='flex gap-2.5 mt-5'>
							<button
								onClick={() => setShowEndModal(false)}
								className='flex-1 py-[14px] bg-black/[0.05] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl text-neutral-800 dark:text-white text-[14px] font-semibold cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-200'>
								Keep going
							</button>
							<button
								onClick={() => { setRunning(false); setShowEndModal(false); }}
								className='flex-1 py-[14px] bg-red-500/10 dark:bg-red-500/15 border border-red-500/25 dark:border-red-500/30 rounded-xl text-red-400 text-[14px] font-semibold cursor-pointer hover:bg-red-500/20 transition-colors duration-200'>
								End fast
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Today;