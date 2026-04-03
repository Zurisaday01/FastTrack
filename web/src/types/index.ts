export interface Goal {
    id?: string; // uuid when updated, optional when creating
	title: string;
	windowStart: string; // ISO date string
	windowEnd: string; // ISO date string
	updatedAt?: string; // ISO date string, optional for create, set by backend
	createdAt?: string; // ISO date string, optional for create, set by backend
}

export interface CreateUpdateGoalParams {
	id?: string; // Optional for create, required for update
	title: string;
	windowStart: string;
	windowEnd: string;
}