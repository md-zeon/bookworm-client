import { cookies } from "next/headers";

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
	const token = (await cookies()).get("token")?.value;

	const headers = new Headers(options.headers);
	if (token) headers.set("Authorization", `Bearer ${token}`);
	headers.set("Content-Type", "application/json");

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
		{
			...options,
			headers,
		},
	);

	return response.json();
};

export default apiFetch;
