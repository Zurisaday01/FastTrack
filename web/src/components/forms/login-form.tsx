'use client';

import { useForm } from '@tanstack/react-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import { loginSchema } from '@/lib/schemas';
import TimerRing from '../time-ring';
import PasswordField from '../password-field';
import { useLogin } from '@/hooks/auth/use-login';

const LoginForm = () => {
	const { isLoggingin, login } = useLogin();
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
		},
		validators: {
			onSubmit: loginSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				login(
					{
						email: value.email,
						password: value.password,
					},
					{ onSuccess: () => form.reset() },
				);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : 'Something went wrong',
				);
			}
		},
	});

	const isLoading = isLoggingin || form.state.isValidating;

	return (
		<Card className='form-card'>
			<CardHeader className='flex items-center gap-[14px] mb-9'>
				<TimerRing />
				<div>
					<CardTitle className='m-0 text-[22px] font-semibold tracking-[-0.02em] text-black dark:text-white'>
						FastTrack
					</CardTitle>
					<CardDescription className='mt-[2px] text-[13px] text-black/45 dark:text-white/35'>
						Welcome back
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<form
					id='register-form'
					onSubmit={e => {
						e.preventDefault();
						form.handleSubmit();
					}}>
					<FieldGroup>
						<form.Field
							name='email'
							children={field => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel className='form-label' htmlFor={field.name}>
											Email
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={e => field.handleChange(e.target.value)}
											aria-invalid={isInvalid}
											placeholder='john.doe@example.com'
											autoComplete='off'
											type='email'
											className='input-field'
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>

						<form.Field
							name='password'
							children={field => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name} className='form-label'>
											Password
										</FieldLabel>
										<PasswordField
											id={field.name}
											label='Password'
											placeholder='Min. 8 characters'
											value={field.state.value}
											onChange={e => field.handleChange(e.target.value)}
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						/>
					</FieldGroup>
				</form>
			</CardContent>
			<CardFooter className='bg-transparent flex flex-col items-center gap-2 my-6'>
				<Field>
					<Button
						type='submit'
						form='register-form'
						className='primary-button'
						disabled={isLoading}>
						Start Tracking
					</Button>
				</Field>
				<div className='mt-6 flex flex-col items-center gap-3'>
					<p className='text-center text-black/45 dark:text-white/35'>
						New to FastTrack?{' '}
						<a
							href='/register'
							className='cursor-pointer font-medium no-underline transition-opacity hover:opacity-80 text-[oklch(68.123%_0.1756_246.111)]'>
							Create an account
						</a>
					</p>

					<p className='text-center text-xs leading-relaxed text-black/30 dark:text-white/20'>
						By continuing, you agree to our Terms of Service
						<br />
						and Privacy Policy.
					</p>
				</div>
			</CardFooter>
		</Card>
	);
};

export default LoginForm;
