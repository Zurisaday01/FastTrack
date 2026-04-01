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

export const getProfile = async () => {
	const response = await fetch(`${API_URL}/api/auth/me`, {
		method: 'GET',
		credentials: 'include', // Include cookies for session management
	});

	if (!response.ok) {
		return null; // Not logged in or error occurred
	}

	return await response.json();
};
