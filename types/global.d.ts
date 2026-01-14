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

export interface UserLibrary {
	_id: string;
	userId: string;
	bookId: string;
	shelf: "wantToRead" | "currentlyReading" | "read";
	progress: number;
	createdAt: string;
	updatedAt: string;
	book: Book;
}

export interface Review {
	_id: string;
	userId: string;
	bookId: string;
	rating: number;
	text: string;
	status: "pending" | "approved" | "rejected";
	createdAt: string;
	updatedAt: string;
	user?: {
		_id: string;
		name: string;
		email?: string;
	};
	book?: {
		_id: string;
		title: string;
		author: string;
		coverImage: string;
	};
}

export interface ReadingGoal {
	_id: string;
	userId: string;
	annualGoal: number;
	currentYear: number;
	startDate: Date;
	createdAt: string;
	updatedAt: string;
}

export interface ReadingStats {
	goal: ReadingGoal | null;
	stats: {
		booksRead: number;
		booksCurrentlyReading: number;
		booksWantToRead: number;
		totalPagesRead: number;
		totalPagesCurrentlyReading: number;
		year: number;
	};
	readingStreak: {
		current: number;
		longest: number;
		lastReadDate: Date | null;
	};
}

export interface MonthlyProgress {
	year: number;
	months: Array<{
		month: number;
		booksRead: number;
		totalPages: number;
	}>;
}

export interface GenreBreakdown {
	year: number;
	genres: Array<{
		_id: string;
		genre: string;
		booksRead: number;
		totalPages: number;
	}>;
}

export interface Recommendation {
	recommendations: Book[];
	reason: string;
}
