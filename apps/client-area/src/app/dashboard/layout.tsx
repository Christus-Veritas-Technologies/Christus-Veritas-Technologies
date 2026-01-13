import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { DashboardShell } from "@/components/dashboard-shell";

interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    clientId?: string;
    exp: number;
    iat: number;
}

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    console.log("[DashboardLayout] Auth token exists:", !!authToken?.value);

    if (!authToken?.value) {
        console.log("[DashboardLayout] No auth token, redirecting to signin");
        redirect("/auth/signin");
    }

    let user: JwtPayload;
    try {
        user = jwtDecode<JwtPayload>(authToken.value);
        console.log("[DashboardLayout] Decoded user:", user.email, "Role:", user.role);

        // Check if token is expired
        const now = Math.floor(Date.now() / 1000);
        if (user.exp < now) {
            console.log("[DashboardLayout] Token expired, redirecting to signin");
            redirect("/auth/signin");
        }
    } catch (error) {
        console.log("[DashboardLayout] Error decoding token:", error);
        redirect("/auth/signin");
    }

    return (
        <DashboardShell userEmail={user.email}>
            {children}
        </DashboardShell>
    );
}
