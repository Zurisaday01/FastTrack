import { updateGoal as updateGoalApi } from '@/services/api-goals';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateGoal = ({ onClose }: { onClose: () => void }) => {
	const queryClient = useQueryClient();

	const { isPending: isUpdating, mutate: updateGoal } = useMutation({
		mutationFn: updateGoalApi,
		onSuccess: (_, variables) => {
			toast.success('Goal updated successfully!');

			queryClient.invalidateQueries({ queryKey: ['goals'] });
			queryClient.invalidateQueries({
				queryKey: ['goal', variables.id],
			});

			onClose();
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isUpdating, updateGoal };
};
