export interface AuthUser {
	id: string;
	name: string;
	email: string;
	role: "user" | "admin";
	photoURL?: string;
}

export interface User {
	_id: string;
	name: string;
	email: string;
	role: "user" | "admin";
	photoURL?: string;
	readingGoals?: {
		annualGoal: number;
		currentYear: number;
		startDate: Date | null;
	};
	readingStreak?: {
		current: number;
		longest: number;
		lastReadDate: Date | null;
	};
	createdAt: string;
	updatedAt: string;
}

export interface Genre {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}

export interface Book {
	_id: string;
	title: string;
	author: string;
	genre: string;
	description?: string;
	coverImage: string;
	totalPages: number;
	averageRating: number;
	totalReviews: number;
	createdAt: string;
	updatedAt: string;
}
