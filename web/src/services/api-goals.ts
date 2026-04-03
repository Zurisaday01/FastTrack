import { API_URL } from '@/lib/constants';
import { to12Hour } from '@/lib/utils';
import type { CreateUpdateGoalParams } from '@/types';

export const getGoals = async () => {
	try {
		const response = await fetch(`${API_URL}/api/goals`, {
			credentials: 'include', // Include cookies for session management
		});
		if (!response.ok) {
			throw new Error('Failed to fetch goals');
		}
		const data = await response.json();

		return data;
	} catch (error) {
		console.error('Error fetching goals:', error);
		throw error;
	}
};

export const getGoalById = async (goalId: string) => {
	try {
		const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
			credentials: 'include', // Include cookies for session management
		});
		if (!response.ok) {
			throw new Error('Failed to fetch goal');
		}
		const goal = await response.json();
		return goal;
	} catch (error) {
		console.error('Error fetching goal:', error);
		throw error;
	}
};

export const createGoal = async ({
	title,
	windowStart,
	windowEnd,
}: CreateUpdateGoalParams) => {
	try {
		const response = await fetch(`${API_URL}/api/goals`, {
			credentials: 'include', // Include cookies for session management
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				windowStart: to12Hour(windowStart),
				windowEnd: to12Hour(windowEnd),
			}),
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || 'Failed to create goal');
		}

		return data;
	} catch (error) {
		console.error('Error creating goal:', error);
		throw error;
	}
};

export const updateGoal = async ({
	id,
	title,
	windowStart,
	windowEnd,
}: CreateUpdateGoalParams) => {
	try {
		const response = await fetch(`${API_URL}/api/goals/${id}`, {
			credentials: 'include', // Include cookies for session management
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id,
				title,
				windowStart,
				windowEnd,
			}),
		});
		if (!response.ok) {
			throw new Error('Failed to update campaign');
		}
		// Backend returns 204 No Content on successful update
		if (response.status === 204) return null;
		return response.json();
	} catch (error) {
		console.error('Error updating goal:', error);
		throw error;
	}
};

export const deleteGoal = async (goalId: string) => {
	try {
		const response = await fetch(`${API_URL}/api/goals/${goalId}`, {
			method: 'DELETE',
			credentials: 'include',
		});
		if (!response.ok) {
			throw new Error('Failed to delete goal');
		}
		return true;
	} catch (error) {
		console.error('Error deleting goal:', error);
		throw error;
	}
};
