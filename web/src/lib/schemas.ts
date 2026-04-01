import * as z from 'zod';

// Schemas
export const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address.'),
	password: z
		.string()
		.min(8, 'Password must be at least 6 characters.')
		.max(100, 'Password must be at most 100 characters.'),
});

export const registerSchema = z
	.object({
		firstName: z
			.string()
			.min(2, 'First Name must be at least 2 characters.')
			.max(50, 'First Name must be at most 50 characters.'),
		lastName: z
			.string()
			.min(2, 'Last Name must be at least 2 characters.')
			.max(50, 'Last Name must be at most 50 characters.'),
		email: z.string().email('Please enter a valid email address.'),
		password: z
			.string()
			.min(6, 'Password must be at least 6 characters.')
			.max(100, 'Password must be at most 100 characters.'),
		confirm: z
			.string()
			.min(6, 'Confirm Password must be at least 6 characters.')
			.max(100, 'Confirm Password must be at most 100 characters.'),
	})
	.refine(data => data.password === data.confirm, {
		message: 'Passwords do not match.',
        path: ['confirm'], // this will attach the error to the confirm field
	});

// Types
export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
