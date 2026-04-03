import { getGoalById as getGoalByIdApi } from '@/services/api-goals';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

export const useGoal = () => {
	const { goalId } = useParams<{ goalId: string }>();

	const {
		isLoading,
		data: campaign,
		error,
	} = useQuery({
		queryKey: ['goal', goalId],
		queryFn: () => getGoalByIdApi(goalId || ''),
	});

	return { isLoading, campaign, error };
};
