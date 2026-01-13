import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import CONFIG from "./constants/config";

const JWT_SECRET = CONFIG.JWT_SECRET!;

interface TokenPayload {
	id: string;
	name: string;
	email: string;
	role: string;
}

interface DecodedToken extends TokenPayload, jwt.JwtPayload {}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Allow API and static files
	if (
		pathname.startsWith("/api") ||
		pathname.startsWith("/_next/static") ||
		pathname.startsWith("/_next/image") ||
		pathname === "/favicon.ico"
	) {
		return NextResponse.next();
	}

	// Read token from cookies
	const token = request.cookies.get("token")?.value;

	let userRole: string | null = null;

	if (token) {
		try {
			const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
			userRole = decoded.role;
		} catch (err) {
			console.log("Invalid JWT:", err);
			// Invalid token → clear it
			const res = NextResponse.redirect(new URL("/signin", request.url));
			res.cookies.delete("token");
			return res;
		}
	}

	// 1. Redirect unauthenticated users to /signin
	if (!token && !["/signin", "/signup"].includes(pathname)) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	// 2. Redirect authenticated users away from auth pages
	if (token && ["/signin", "/signup"].includes(pathname)) {
		if (userRole === "admin")
			return NextResponse.redirect(new URL("/admin/dashboard", request.url));
		return NextResponse.redirect(new URL("/user/library", request.url));
	}

	// 3. Prevent non-admin users from accessing admin pages
	if (pathname.startsWith("/admin") && userRole !== "admin") {
		return NextResponse.redirect(new URL("/user/library", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
