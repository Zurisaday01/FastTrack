import { API_URL } from '@/lib/constants';

interface RegisterData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export const register = async ({
	firstName,
	lastName,
	email,
	password,
}: RegisterData) => {
	const response = await fetch(`${API_URL}/api/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ firstName, lastName, email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('Registration error:', errorData);
		throw new Error(errorData.message || 'Registration failed');
	}

	return await response.json();
};

interface LoginData {
	email: string;
	password: string;
}

export const login = async ({ email, password }: LoginData) => {
	const response = await fetch(`${API_URL}/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include', // Include cookies for session management
		body: JSON.stringify({ email, password }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || 'Login failed');
	}

	return await response.json();
};

// When the access token expires (15 min) this will return 401
export const getProfile = async () => {
	const response = await fetch(`${API_URL}/api/auth/me`, {
		method: 'GET',
		credentials: 'include', // Include cookies for session management
	});

	// Access token expired — try to refresh
	if (response.status === 401) {
		try {
			await refreshTokens(); // Go sets new cookies automatically
			// Retry the original request
			const retryResponse = await fetch(`${API_URL}/api/auth/me`, {
				method: 'GET',
				credentials: 'include',
			});
			if (!retryResponse.ok) return null;
			return retryResponse.json();
		} catch {
			return null; // Refresh token also expired, user must log in again
		}
	}

	return await response.json();
};

export const refreshTokens = async () => {
	const response = await fetch(`${API_URL}/api/auth/refresh`, {
		method: 'POST',
		credentials: 'include',
	});

	if (!response.ok) throw new Error('Session expired');
	return response.json();
};

export const logout = async () => {
	const response = await fetch(`${API_URL}/api/auth/logout`, {
		method: 'POST',
		credentials: 'include', // Include cookies for session management
	});

	if (!response.ok) {
		throw new Error('Logout failed');
	}
};
