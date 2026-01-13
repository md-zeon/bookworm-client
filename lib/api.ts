import apiFetch from "./handlers/fetch";

interface SignInParams {
	email: string;
	password: string;
}

interface SignUpParams {
	name: string;
	email: string;
	password: string;
	photoURL?: string;
}

export const api = {
	auth: {
		signIn: ({ email, password }: SignInParams) =>
			apiFetch("/auth/signin", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			}),
		signUp: ({ name, email, password, photoURL }: SignUpParams) =>
			apiFetch("/auth/signup", {
				method: "POST",
				body: JSON.stringify({ name, email, password, photoURL }),
			}),
		signOut: () =>
			apiFetch("/auth/signout", {
				method: "POST",
			}),
	},
};
