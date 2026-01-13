import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    userId: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
}

/**
 * Server-side route protection for server components
 * Call this at the top of any protected server component page
 */
export async function protectRoute(options?: {
    requireAdmin?: boolean;
    redirectTo?: string;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    // If not authenticated, redirect to signin
    if (!authToken) {
        redirect(options?.redirectTo || "/auth/signin");
    }

    try {
        const decoded = jwtDecode<TokenPayload>(authToken.value);

        // Check email verification
        if (!decoded.emailVerified) {
            redirect("/auth/success");
        }

        // If admin access required but user is not admin
        if (options?.requireAdmin && !decoded.isAdmin) {
            redirect("/dashboard");
        }

        // If user is admin and trying to access client dashboard, redirect to admin
        if (!options?.requireAdmin && decoded.isAdmin) {
            redirect("/ultimate/dashboard");
        }

        return {
            userId: decoded.userId,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            token: authToken.value,
        };
    } catch {
        // If token is invalid, redirect to signin
        redirect(options?.redirectTo || "/auth/signin");
    }
}

/**
 * Get auth token from cookies (server-side)
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");
    return authToken?.value || null;
}
