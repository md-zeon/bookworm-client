import apiFetch from "./handlers/fetch";

export const api = {
	auth: {
		signIn: ({ email, password }: { email: string; password: string }) =>
			apiFetch("auth/signin", {
				method: "POST",
				body: JSON.stringify({ email, password }),
			}),
		signUp: ({
			name,
			email,
			password,
			photoURL,
		}: {
			name: string;
			email: string;
			password: string;
			photoURL?: string;
		}) =>
			apiFetch("auth/signup", {
				method: "POST",
				body: JSON.stringify({ name, email, password, photoURL }),
			}),
	},
};
