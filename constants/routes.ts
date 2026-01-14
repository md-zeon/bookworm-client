const ROUTES = {
	HOME: "/",
	SIGN_IN: "/signin",
	SIGN_UP: "/signup",
	ADMIN: {
		DASHBOARD: "/admin/dashboard",
		BOOKS: "/admin/books",
		GENRES: "/admin/genres",
		REVIEWS: "/admin/reviews",
		USERS: "/admin/users",
		SETTINGS: "/admin/settings",
		TUTORIALS: "/admin/tutorials",
	},
	USER: {
		DASHBOARD: "/user/dashboard",
		BROWSE: "/user/browse",
		LIBRARY: "/user/library",
		REVIEWS: "/user/reviews",
		RECOMMENDATIONS: "/user/recommendations",
		GOALS: "/user/goals",
		PROFILE: "/user/profile",
	},
};

export default ROUTES;
