export interface SignInParams {
	email: string;
	password: string;
}

export interface SignUpParams {
	name: string;
	email: string;
	password: string;
	photoURL?: string;
}
