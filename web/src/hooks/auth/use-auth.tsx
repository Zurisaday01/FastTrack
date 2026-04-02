import { getProfile as getProfileApi } from '@/services/api-auth';
import { useQuery } from '@tanstack/react-query';

export const useAuth = () => {
	// Just under 15 minutes, since the access token expires after 15 minutes
	return useQuery({
		queryKey: ['auth', 'me'],
		queryFn: getProfileApi,
		retry: false,
		staleTime: 14 * 60 * 1000,
	});
};
