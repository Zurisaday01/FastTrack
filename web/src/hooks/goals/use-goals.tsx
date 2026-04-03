import { getGoals } from '@/services/api-goals';
import type { Goal } from '@/types';
import { useQuery } from '@tanstack/react-query';

// NOTE: For now since it is not stablish to handle one or multiple goals, we are not using filters, pagination, or sorting. We will add those features in the future when we have a better understanding of the use cases and requirements.
export const useGoals = (): {
	isLoading: boolean;
	error: unknown;
	goals: Goal[];
} => {
	const { isLoading, data, error } = useQuery({
		queryKey: ['goals'],
		queryFn: () => getGoals(),
	});

	return { isLoading, error, goals: data || [] };
};
