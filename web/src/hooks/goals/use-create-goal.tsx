import { createGoal as createGoalApi } from '@/services/api-goals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface UseCreateGoalReturn {
	onClose: () => void;
}

export const useCreateGoal = ({ onClose }: UseCreateGoalReturn) => {
	const queryClient = useQueryClient();

	const { isPending: isCreating, mutate: createGoal } = useMutation({
		mutationFn: createGoalApi,
		onSuccess: data => {
			// Send feedback to the user
			toast.success(`Goal "${data.title}" created successfully!`);
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['goals'] });

			// Close the modal
			onClose();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isCreating, createGoal };
};
