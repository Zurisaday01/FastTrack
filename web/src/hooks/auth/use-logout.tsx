import { logout as logoutApi } from '@/services/api-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLogout = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { isPending: isLoggingout, mutate: logout } = useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			// Send feedback to the user
			toast.success('Logged out successfully!');
			// removeQueries wipes it immediately tht way useAuth returns null right away
			queryClient.removeQueries({ queryKey: ['auth'] });

			navigate('/login');
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isLoggingout, logout };
};
