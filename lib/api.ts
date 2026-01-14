import { Book, Genre } from "@/types/global";
import apiFetch from "./handlers/fetch";
import { SignInParams, SignUpParams } from "./types/api";

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
};
