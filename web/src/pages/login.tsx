import LoginForm from '@/components/forms/login-form';
import ModeToggle from '@/components/mode-toggle';
import { useTheme } from '@/hooks/use-theme';

const Login = () => {
	const { theme } = useTheme();

	const isDarkMode = theme === 'dark';
	const dark = isDarkMode;

	return (
		<>
			<div
				className='min-h-screen flex items-center justify-center p-6 relative overflow-hidden'
				style={{ background: dark ? '#0D0D18' : 'oklch(93% 0.025 240)' }}>
				{/* bg glows */}
				<div
					className='absolute w-[380px] h-[380px] rounded-full blur-[90px] pointer-events-none -top-20 -left-20 transition-opacity duration-300'
					style={{
						background:
							'radial-gradient(circle, oklch(68.123% 0.1756 246.111), transparent)',
						opacity: dark ? 0.35 : 0.18,
					}}
				/>
				<div
					className='absolute w-[380px] h-[380px] rounded-full blur-[90px] pointer-events-none -bottom-24 -right-16 transition-opacity duration-300'
					style={{
						background:
							'radial-gradient(circle, oklch(64.065% 0.19745 252.99), transparent)',
						opacity: dark ? 0.3 : 0.15,
					}}
				/>

				{/* theme toggle */}
				<div className='absolute top-2 right-2'>
					<ModeToggle />
				</div>

				{/* card */}
				<LoginForm />
			</div>
		</>
	);
};

export default Login;
