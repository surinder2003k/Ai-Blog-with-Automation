'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "adminpassword123";
const SESSION_COOKIE_NAME = "master_admin_session";

export async function adminLogin(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        // Setting a simple but secure session cookie
        // In a real app, this would be an encrypted JWT
        cookieStore.set(SESSION_COOKIE_NAME, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/"
        });

        return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/");
}

export async function isMasterAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE_NAME)?.value === "true";
}
