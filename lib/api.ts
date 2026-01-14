import { Book, Genre, User } from "@/types/global";
import apiFetch from "./handlers/fetch";
import { SignInParams, SignUpParams, Settings } from "./types/api";

export const api = {
	auth: {
		signIn: <T = unknown>({ email, password }: SignInParams) =>
			apiFetch<T>("/auth/signin", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			}),
		signUp: <T = unknown>({ name, email, password, photoURL }: SignUpParams) =>
			apiFetch<T>("/auth/signup", {
				method: "POST",
				body: JSON.stringify({ name, email, password, photoURL }),
			}),
		signOut: () =>
			apiFetch<null>("/auth/signout", {
				method: "POST",
			}),
	},
	genres: {
		getAll: <T>() => apiFetch<T>("/admin/genres"),
		create: <T = Genre>(name: string) =>
			apiFetch<T>("/admin/genres", {
				method: "POST",
				body: JSON.stringify({ name }),
			}),
		update: <T = Pick<Genre, "_id" | "name">>(id: string, name: string) =>
			apiFetch<T>(`/admin/genres/${id}`, {
				method: "PATCH",
				body: JSON.stringify({ name }),
			}),
		delete: <T = null>(id: string) =>
			apiFetch<T>(`/admin/genres/${id}`, {
				method: "DELETE",
			}),
	},
	books: {
		getAll: <T = Book[]>(params?: string) =>
			apiFetch<T>(`/admin/books${params ? `?${params}` : ""}`),
		getById: <T = Book>(id: string) => apiFetch<T>(`/admin/books/${id}`),
		create: <T = Book>(bookData: Partial<Book>) =>
			apiFetch<T>("/admin/books", {
				method: "POST",
				body: JSON.stringify(bookData),
			}),
		update: <T = Book>(id: string, bookData: Partial<Book>) =>
			apiFetch<T>(`/admin/books/${id}`, {
				method: "PATCH",
				body: JSON.stringify(bookData),
			}),
		delete: <T = null>(id: string) =>
			apiFetch<T>(`/admin/books/${id}`, {
				method: "DELETE",
			}),
	},
	users: {
		getAll: <T = User[]>() => apiFetch<T>("/admin/users"),
		getCurrentUser: <T = User>() => apiFetch<T>("/user/profile"),
		updateProfile: <T = User>(data: Partial<User>) =>
			apiFetch<T>("/user/profile", {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		updateRole: <T = User>({
			id,
			role,
		}: {
			id: string;
			role: "user" | "admin";
		}) =>
			apiFetch<T>(`/admin/users/${id}/role`, {
				method: "PATCH",
				body: JSON.stringify({ role }),
			}),
		delete: <T = null>(id: string) =>
			apiFetch<T>(`/admin/users/${id}`, { method: "DELETE" }),
	},
	// User library endpoints
	library: {
		addToLibrary: <T = unknown>(
			bookId: string,
			data: { shelf?: string; progress?: number },
		) =>
			apiFetch<T>("/user/library", {
				method: "POST",
				body: JSON.stringify({ bookId, ...data }),
			}),
		getLibrary: <T = unknown>(shelf?: string) =>
			apiFetch<T>(`/user/library${shelf ? `?shelf=${shelf}` : ""}`),
		updateProgress: <T = unknown>(bookId: string, progress: number) =>
			apiFetch<T>(`/user/library/${bookId}/progress`, {
				method: "PUT",
				body: JSON.stringify({ progress }),
			}),
		removeFromLibrary: <T = unknown>(bookId: string) =>
			apiFetch<T>(`/user/library/${bookId}`, { method: "DELETE" }),
	},
	// User review endpoints
	reviews: {
		submitReview: <T = unknown>(
			bookId: string,
			data: { rating: number; text: string },
		) =>
			apiFetch<T>(`/user/reviews/books/${bookId}`, {
				method: "POST",
				body: JSON.stringify(data),
			}),
		getUserReviews: <T = unknown>(status?: string) =>
			apiFetch<T>(`/user/reviews${status ? `?status=${status}` : ""}`),
		getBookReviews: <T = unknown>(bookId: string) =>
			apiFetch<T>(`/user/reviews/books/${bookId}`),
		updateReview: <T = unknown>(
			reviewId: string,
			data: { rating: number; text: string },
		) =>
			apiFetch<T>(`/user/reviews/${reviewId}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		deleteReview: <T = unknown>(reviewId: string) =>
			apiFetch<T>(`/user/reviews/${reviewId}`, { method: "DELETE" }),
	},
	// User goals and stats endpoints
	goals: {
		setReadingGoal: <T = unknown>(annualGoal: number) =>
			apiFetch<T>("/user/goals", {
				method: "POST",
				body: JSON.stringify({ annualGoal }),
			}),
		getReadingStats: <T = unknown>() => apiFetch<T>("/user/stats"),
		getMonthlyProgress: <T = unknown>(year?: number) =>
			apiFetch<T>(`/user/stats/monthly${year ? `?year=${year}` : ""}`),
		getGenreBreakdown: <T = unknown>() => apiFetch<T>("/user/stats/genres"),
	},
	// User recommendations endpoints
	recommendations: {
		getRecommendations: <T = unknown>(limit?: number) =>
			apiFetch<T>(`/user/recommendations${limit ? `?limit=${limit}` : ""}`),
	},
	// Admin review moderation endpoints
	adminReviews: {
		getPendingReviews: <T = unknown>(page?: number, limit?: number) =>
			apiFetch<T>(
				`/admin/reviews/pending${
					page && limit ? `?page=${page}&limit=${limit}` : ""
				}`,
			),
		approveReview: <T = unknown>(reviewId: string) =>
			apiFetch<T>(`/admin/reviews/${reviewId}/approve`, { method: "PUT" }),
		rejectReview: <T = unknown>(reviewId: string) =>
			apiFetch<T>(`/admin/reviews/${reviewId}/reject`, { method: "PUT" }),
		deleteReview: <T = unknown>(reviewId: string) =>
			apiFetch<T>(`/admin/reviews/${reviewId}`, { method: "DELETE" }),
		getReviewStats: <T = unknown>() => apiFetch<T>("/admin/reviews/stats"),
	},
	// Admin settings endpoints
	settings: {
		get: <T = Settings>() => apiFetch<T>("/admin/settings"),
		update: <T = Settings>(data: Partial<Settings>) =>
			apiFetch<T>("/admin/settings", {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		reset: <T = Settings>() =>
			apiFetch<T>("/admin/settings/reset", { method: "DELETE" }),
	},
	// Tutorial endpoints
	tutorials: {
		getAll: <T = unknown>() => apiFetch<T>("/admin/tutorials"),
		create: <T = unknown>(data: {
			title: string;
			description: string;
			videoUrl: string;
		}) =>
			apiFetch<T>("/admin/tutorials", {
				method: "POST",
				body: JSON.stringify(data),
			}),
		update: <T = unknown>(
			id: string,
			data: { title: string; description: string; videoUrl: string },
		) =>
			apiFetch<T>(`/admin/tutorials/${id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}),
		delete: <T = unknown>(id: string) =>
			apiFetch<T>(`/admin/tutorials/${id}`, { method: "DELETE" }),
	},
};
