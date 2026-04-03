'use client';

import { Button } from '@/components/ui/button';

import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { createUpdateGoalFormSchema } from '@/lib/schemas';
import { useForm } from '@tanstack/react-form';

import { Spinner } from '@/components/ui/spinner';

import { useCreateGoal } from '@/hooks/goals/use-create-goal';
import { useUpdateGoal } from '@/hooks/goals/use-update-goal';
import type { Goal } from '@/types';

interface CreateUpdateGoalFormProps {
	onClose: () => void;
	type?: 'create' | 'update';
	goal: Goal | null;
}

export function CreateUpdateGoalForm({
	onClose,
	goal,
	type = 'create',
}: CreateUpdateGoalFormProps) {
	const { isCreating, createGoal } = useCreateGoal({ onClose });
	const { isUpdating, updateGoal } = useUpdateGoal({ onClose });

	const form = useForm({
		defaultValues: {
			title: '',
			windowStart: '',
			windowEnd: '',
		},
		validators: {
			onSubmit: createUpdateGoalFormSchema,
		},
		onSubmit: async ({ value }) => {
			if (type === 'create') {
				try {
					createGoal(
						{
							...value,
						},
						{ onSuccess: () => form.reset() },
					);
				} catch (error) {
					toast.error(
						error instanceof Error ? error.message : 'Something went wrong',
					);
				}
			} else if (type === 'update' && goal) {
				try {
					updateGoal({
						id: goal.id,
						...value,
					});
				} catch (error) {
					toast.error(
						error instanceof Error ? error.message : 'Something went wrong',
					);
				}
			}
		},
	});

	const isLoading = isCreating || isUpdating || form.state.isValidating;

	return (
		<form
			id='create-update-goal-form'
			onSubmit={e => {
				e.preventDefault();
				form.handleSubmit();
			}}>
			<FieldGroup>
				<form.Field
					name='title'
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel className='form-label' htmlFor={field.name}>
									Title
								</FieldLabel>
								<Input
									disabled={isLoading}
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder='OMAD, 16:8, etc.'
									autoComplete='off'
									className='input-field'
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>

				<form.Field
					name='windowStart'
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel className='form-label' htmlFor={field.name}>
									Window Start
								</FieldLabel>
								<Input
									disabled={isLoading}
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder='Window start'
									autoComplete='off'
									type='time'
									step='1'
									className='input-field appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
								/>

								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
				<form.Field
					name='windowEnd'
					children={field => {
						const isInvalid =
							field.state.meta.isTouched && !field.state.meta.isValid;
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel className='form-label' htmlFor={field.name}>
									Window End
								</FieldLabel>
								<Input
									disabled={isLoading}
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={e => field.handleChange(e.target.value)}
									aria-invalid={isInvalid}
									placeholder='Window start'
									autoComplete='off'
									type='time'
									step='1'
									className='input-field appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
								/>

								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				/>
			</FieldGroup>

			<Field className='mt-8'>
				<Button
					type='submit'
					form='create-update-goal-form'
					className='primary-button'
					disabled={isLoading}>
					{isLoading ? <Spinner /> : type === 'create' ? 'Create' : 'Update'}
				</Button>
			</Field>
		</form>
	);
}
