// components/auth/public-route.tsx
import { Navigate, Outlet } from 'react-router-dom';

import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/auth/use-auth';

const PublicRoute = () => {
	const { data: user, isLoading } = useAuth();

	if (isLoading) return <Spinner />;
	if (user) return <Navigate to='/today' />;

	return <Outlet />;
};
export default PublicRoute;
