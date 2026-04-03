import { deleteGoal as deleteGoalApi } from '@/services/api-goals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useDeleteGoal = () => {
	const queryClient = useQueryClient();

	const { isPending: isDeleting, mutate: deleteGoal } = useMutation({
		mutationFn: deleteGoalApi,
		onSuccess: () => {
			// Send feedback to the user
			toast.success('Goal deleted successfully!');
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['goals'] });
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isDeleting, deleteGoal };
};
