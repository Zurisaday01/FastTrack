import { login as loginApi } from '@/services/api-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface LoginData {
	email: string;
}

export const useLogin = () => {
	const queryClient = useQueryClient();

	const { isPending: isLoggingin, mutate: login } = useMutation({
		mutationFn: loginApi,
		onSuccess: ({ email }: LoginData) => {
			// Send feedback to the user
			toast.success(`Welcome, ${email}!`);
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['auth'] });
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isLoggingin, login };
};
