"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import CONFIG from "@/constants/config";

/**
 * LOGGING IN
 */

export async function signInAction(formData: FormData) {
	const payload = Object.fromEntries(formData);

	try {
		const res = await fetch(`${CONFIG.API_URL}/auth/signin`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		const data = await res.json();

		if (data.success) {
			const cookieStore = await cookies();

			// 1. Set the Token
			cookieStore.set("token", data.token, {
				httpOnly: true,
				secure: CONFIG.NODE_ENV === "production",
				maxAge: 60 * 60 * 24 * 7, // 1 week
				path: "/",
			});

			// 2. Set the Role
			cookieStore.set("role", data.user.role, {
				path: "/",
				maxAge: 60 * 60 * 24 * 7,
			});

			revalidatePath("/");

			return { success: true, role: data.user.role };
		}

		return { success: false, message: data.message || "Invalid credentials" };
	} catch (error) {
		return { success: false, message: "Network error. Please try again." };
	}
}

/**
 * LOGGING OUT
 * Clears cookies and purges cache
 */
export async function signOutAction() {
	const cookieStore = await cookies();

	cookieStore.delete("token");
	cookieStore.delete("role");

	// Purge cache so user is recognized as "Guest" everywhere
	revalidatePath("/");
}
