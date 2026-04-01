import { getProfile as getProfileApi } from '@/services/api-auth';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
	return useQuery({
		queryKey: ['auth', 'me'],
		queryFn: getProfileApi,
		retry: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};
