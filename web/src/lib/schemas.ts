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
		// refine: shows the error when the condition returns false
		message: 'Passwords do not match.',
		path: ['confirm'], // this will attach the error to the confirm field
	});

// HH:MM:SS
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createUpdateGoalFormSchema = z
	.object({
		title: z
			.string()
			.min(3, 'Title must be at least 3 characters.')
			.max(100, 'Title must be at most 100 characters.'),
		windowStart: z
			.string()
			.regex(timeRegex, 'Please enter a valid time (HH:MM:SS).'),
		windowEnd: z
			.string()
			.regex(timeRegex, 'Please enter a valid time (HH:MM:SS).'),
	})
	.refine(data => data.windowStart !== data.windowEnd, {
		message: 'Window times must be different',
		path: ['windowEnd'],
	});

// Types
export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type CreateUpdateGoalFormValues = z.infer<
	typeof createUpdateGoalFormSchema
>;
