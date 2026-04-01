interface LogoProps {
	collapsed: boolean;
}

const Logo = ({ collapsed }: LogoProps) => {
	return (
		<div
			className={`
        flex items-center gap-[10px] overflow-hidden
        transition-all duration-300 ease-in-out
        ${collapsed ? 'px-[2px]' : 'px-0'}
      `}>
			{/* ring icon */}
			<div className='flex-shrink-0 w-8 h-8'>
				<svg width='32' height='32' viewBox='0 0 64 64'>
					<circle
						cx='32'
						cy='32'
						r='26'
						fill='none'
						stroke='rgba(0, 159, 253,0.25)'
						strokeWidth='5'
					/>
					<circle
						cx='32'
						cy='32'
						r='26'
						fill='none'
						stroke='var(--primary)'
						strokeWidth='5'
						strokeDasharray='82 164'
						strokeLinecap='round'
						transform='rotate(-90 32 32)'
						style={{
							filter: 'drop-shadow(0 0 5px rgba(0, 159, 253,0.55))',
						}}
					/>
					<text
						x='32'
						y='37'
						textAnchor='middle'
						className='fill-dark dark:fill-white'
						fontSize='13'
						fontWeight='700'
						fontFamily='DM Mono'>
						16:00
					</text>
				</svg>
			</div>

			{/* wordmark */}
			<div
				className={`
          overflow-hidden whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[120px] opacity-100'}
        `}>
				<span className='text-[16px] font-bold tracking-[-0.02em] font-[DM Sans]'>
					FastTrack
				</span>
			</div>
		</div>
	);
};

export default Logo;
