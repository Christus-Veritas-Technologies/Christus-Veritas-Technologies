import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    clientId?: string;
    exp: number;
    iat: number;
}

export default async function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    console.log("[OnboardingLayout] Auth token exists:", !!authToken?.value);

    if (!authToken?.value) {
        console.log("[OnboardingLayout] No auth token, redirecting to signin");
        redirect("/auth/signin");
    }

    let user: JwtPayload;
    try {
        user = jwtDecode<JwtPayload>(authToken.value);
        console.log("[OnboardingLayout] Decoded user:", user.email);

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (user.exp < now) {
            console.log("[OnboardingLayout] Token expired, redirecting to signin");
            redirect("/auth/signin");
        }

        // Check if onboarding is already completed
        // We'll do this check in the client component since it needs to fetch user data
        // The server-side check here just ensures the user is authenticated
    } catch (error) {
        console.log("[OnboardingLayout] Error decoding token:", error);
        redirect("/auth/signin");
    }

    return <>{children}</>;
}
