const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
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

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data?.message || "API request failed");
	}

	return data;
};

export default apiFetch;
