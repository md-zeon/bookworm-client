type ApiResponse<T = unknown> = {
	success: boolean;
	message: string;
	data?: T;
};

const apiFetch = async <T = unknown>(
	endpoint: string,
	options: RequestInit = {},
): Promise<ApiResponse<T>> => {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
		{
			...options,
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				...(options.headers || {}),
			},
		},
	);

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result?.message || "API request failed");
	}

	return result;
};

export default apiFetch;
