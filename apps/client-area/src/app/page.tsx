import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  userId: string;
  email: string;
  isAdmin: boolean;
  emailVerified: boolean;
}

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  // If not authenticated, redirect to signin
  if (!authToken) {
    redirect("/auth/signin");
  }

  try {
    // Decode the token to check if user is admin
    const decoded = jwtDecode<TokenPayload>(authToken.value);

    // Check email verification
    if (!decoded.emailVerified) {
      redirect("/auth/success");
    }

    // If admin, redirect to ultimate dashboard
    if (decoded.isAdmin) {
      redirect("/ultimate/dashboard");
    }
  } catch {
    // If token is invalid, redirect to signin
    redirect("/auth/signin");
  }

  // User is authenticated and not admin, redirect to client dashboard
  redirect("/dashboard");
}
