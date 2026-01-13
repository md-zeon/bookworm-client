export interface User {
	id: string;
	name: string;
	email: string;
	role: "user" | "admin";
	photoURL?: string;
}

export interface Genre {
	_id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
}
