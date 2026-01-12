// src/app/actions/auth.ts
"use server";
import { cookies } from "next/headers";

export async function createSession(token: string, role: string) {
	const cookieStore = await cookies();

	// Set the JWT
	cookieStore.set("token", token, {
		httpOnly: true, // Prevents XSS attacks
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 7, // 1 week
		path: "/",
	});

	// Set the Role (needed for Middleware)
	cookieStore.set("role", role, { path: "/", maxAge: 60 * 60 * 24 * 7 });
}
