import CONFIG from "@/constants/config";

type ApiResponse<T = unknown> = {
	success: boolean;
	message: string;
	data?: T;
};

const isServer = typeof window === "undefined";

const apiFetch = async <T = unknown>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> => {
	let headers: HeadersInit = {
		"Content-Type": "application/json",
		...(options.headers || {}),
	};

	// SERVER: forward cookies correctly
	if (isServer) {
		const { cookies } = await import("next/headers");
		const cookieStore = await cookies();

		const cookieHeader = cookieStore
			.getAll()
			.map((c) => `${c.name}=${c.value}`)
			.join("; ");

		if (cookieHeader) {
			headers = {
				...headers,
				cookie: cookieHeader,
			};
		}
	}

	const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
		...options,
		headers,
		credentials: isServer ? "omit" : "include",
		cache: "no-store",
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result?.message || "API request failed");
	}

	return result;
};

export default apiFetch;
