// https://github.com/Zurisaday01/the-wiild-oasis-react-query/blob/main/src/App.jsx

import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layout
import AppLayout from './components/layout/app-layout';

// Layouts
import ProtectedRoute from './components/auth/protected-route';
import PublicRoute from './components/auth/public-route';

// Pages
import Today from './pages/today';
import Stats from './pages/stats';
import History from './pages/history';
import Goals from './pages/goals';
import Settings from './pages/settings';
import Login from './pages/login';
import Register from './pages/register';

import { Toaster } from 'sonner';
import { ThemeProvider } from './context/theme-context';

// Create the Query Client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 0, // Data is considered fresh for 0 milliseconds
		},
	},
});

function App() {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route
							element={
								<ProtectedRoute>
									<AppLayout />
								</ProtectedRoute>
							}>
							<Route index element={<Navigate replace to='today' />} />
							<Route path='today' element={<Today />} />
							<Route path='stats' element={<Stats />} />
							<Route path='history' element={<History />} />
							<Route path='goals' element={<Goals />} />
							<Route path='settings' element={<Settings />} />
							{/* <Route path='quotes' element={<Quotes />} />
						<Route path='quotes/:quoteId' element={<Quote />} /> */}
						</Route>
						<Route element={<PublicRoute />}>
							<Route path='login' element={<Login />} />
							<Route path='register' element={<Register />} />
						</Route>
						{/*<Route path='*' element={<PageNotFound />} /> */}
					</Routes>
				</BrowserRouter>
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
