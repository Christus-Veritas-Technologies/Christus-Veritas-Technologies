import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { UltimateShell } from "@/components/ultimate-shell";
import { Toaster } from "@/components/ui/sonner";

interface JwtPayload {
    sub: string;
    userId: string;
    email: string;
    isAdmin: boolean;
    emailVerified: boolean;
    exp: number;
    iat: number;
}

export default async function UltimateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    console.log("[UltimateLayout] Auth token exists:", !!authToken?.value);

    if (!authToken?.value) {
        console.log("[UltimateLayout] No auth token, redirecting to signin");
        redirect("/auth/signin");
    }

    let user: JwtPayload;
    try {
        user = jwtDecode<JwtPayload>(authToken.value);
    } catch (error) {
        console.log("[UltimateLayout] Error decoding token:", error);
        redirect("/auth/signin");
    }

    console.log("[UltimateLayout] Decoded user:", user.email, "isAdmin:", user.isAdmin);

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (user.exp < now) {
        console.log("[UltimateLayout] Token expired, redirecting to signin");
        redirect("/auth/signin");
    }

    // Check if user is admin
    if (!user.isAdmin) {
        console.log("[UltimateLayout] User is not admin, redirecting to dashboard");
        redirect("/dashboard");
    }

    return (
        <UltimateShell user={{ email: user.email }}>
            {children}
            <Toaster position="top-right" />
        </UltimateShell>
    );
}
