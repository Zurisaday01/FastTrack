import { register as registernApi } from '@/services/api-auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface SignupData {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

export const useSignup = () => {
	const queryClient = useQueryClient();

	const { isPending: isSigningup, mutate: signup } = useMutation({
		mutationFn: registernApi,
		onSuccess: ({ firstName }: SignupData) => {
			// Send feedback to the user
			toast.success(`Thanks for signing up ${firstName}! You can now log in.`);
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: ['auth'] });
		},
		onError: (err: Error) => toast.error(err.message),
	});

	return { isSigningup, signup };
};
