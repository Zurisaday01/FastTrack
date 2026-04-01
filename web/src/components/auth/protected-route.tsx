import { Navigate } from 'react-router-dom';
import { Spinner } from '../ui/spinner';
import { useAuth } from '@/hooks/auth/use-auth';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { data: user, isLoading } = useAuth();

	if (isLoading) return <Spinner />;
	if (!user) return <Navigate to='/login' />;

	return <>{children}</>;
};

export default ProtectedRoute;
