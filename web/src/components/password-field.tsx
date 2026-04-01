import { useState } from 'react';

const EyeIcon = ({ open }: { open: boolean }) => (
	<svg
		width='18'
		height='18'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='1.8'
		strokeLinecap='round'
		strokeLinejoin='round'>
		{open ? (
			<>
				<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
				<circle cx='12' cy='12' r='3' />
			</>
		) : (
			<>
				<path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94' />
				<path d='M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19' />
				<line x1='1' y1='1' x2='23' y2='23' />
			</>
		)}
	</svg>
);

interface InputFieldProps {
	id: string;
	label?: string;
	type?: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	suffix?: React.ReactNode;
	hint?: string;
}

const InputField = ({
	id,
	label,
	type = 'text',
	placeholder,
	value,
	onChange,
	suffix,
	hint,
}: InputFieldProps) => {
	const [focused, setFocused] = useState(false);

	return (
		<div>
			{label && (
				<label className='block text-xs font-medium tracking-[0.08em] uppercase mb-2 text-black/50 dark:text-white/45' htmlFor={id}>
					{label}
				</label>
			)}

			<div className='relative'>
				<input
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					className='w-full rounded-xl px-4 py-[14px] text-[15px] outline-none transition-[border-color,box-shadow] duration-200 border bg-[oklch(96.683%_0.01767_240.181)] text-black dark:bg-white/5 dark:text-white'
					style={{
						paddingRight: suffix ? '3rem' : '1rem',
						borderColor: focused
							? 'oklch(68.123% 0.1756 246.111 / 70%)'
							: undefined,
						boxShadow: focused
							? '0 0 0 3px oklch(68.123% 0.1756 246.111 / 15%)'
							: undefined,
					}}
				/>
				{suffix && (
					<div className='absolute right-[14px] top-1/2 -translate-y-1/2 cursor-pointer flex items-center text-black/40 dark:text-white/35'>
						{suffix}
					</div>
				)}
			</div>
			{hint && (
				<p className='mt-2 text-xs text-black/35 dark:text-white/30'>{hint}</p>
			)}
		</div>
	);
};

interface PasswordFieldProps {
	id: string;
	label: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField = ({
	id,
	placeholder,
	value,
	onChange,
}: PasswordFieldProps) => {
	const [show, setShow] = useState(false);
	return (
		<InputField
			type={show ? 'text' : 'password'}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			id={id}
			suffix={
				<span onClick={() => setShow(s => !s)}>
					<EyeIcon open={show} />
				</span>
			}
		/>
	);
};

export default PasswordField;
