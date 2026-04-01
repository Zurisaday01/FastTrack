const TimerRing = () => (
	<svg width='64' height='64' viewBox='0 0 64 64'>
		<circle
			cx='32'
			cy='32'
			r='28'
			fill='none'
			strokeWidth='4'
			className='stroke-[oklch(90%_0.04_246)] dark:stroke-[#2a2a3a]'
		/>
		<circle
			cx='32'
			cy='32'
			r='28'
			fill='none'
			stroke='oklch(68.123% 0.1756 246.111)'
			strokeWidth='4'
			strokeDasharray='126 176'
			strokeDashoffset='44'
			strokeLinecap='round'
			transform='rotate(-90 32 32)'
			style={{
				filter: 'drop-shadow(0 0 6px oklch(68.123% 0.1756 246.111 / 0.5))',
			}}
		/>
		<text
			x='32'
			y='37'
			textAnchor='middle'
			fontSize='13'
			fontWeight='600'
			fontFamily="'DM Mono', monospace"
			className='fill-[oklch(0.145_0_0)] dark:fill-white'>
			16:00
		</text>
	</svg>
);

export default TimerRing;
