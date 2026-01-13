import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that don't require authentication
const publicPaths = [
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/success",
    "/auth/verify-email",
    "/auth/accept-invitation",
];

// Check if a path starts with any public path
function isPublicPath(path: string): boolean {
    return publicPaths.some(
        (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    );
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Allow static files and API routes
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
        // Redirect to signin if no token
        const url = new URL("/auth/signin", request.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // Try to decode the token to check for emailVerified
    // Note: This is a basic check - full verification happens on the server
    try {
        // JWT tokens are base64url encoded with 3 parts separated by dots
        const parts = token.split(".");
        if (parts.length === 3) {
            // Decode the payload (middle part)
            const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));

            // Check if email is verified (if the claim exists)
            if (payload.emailVerified === false) {
                // Redirect to success page to show verification message
                return NextResponse.redirect(new URL("/auth/success", request.url));
            }
        }
    } catch {
        // If we can't decode, let the request proceed
        // The server will handle proper validation
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
