import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingContent } from "@/components/onboarding-content";

export default async function OnboardingPage() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token");

    // If not authenticated, redirect to signin
    if (!authToken?.value) {
        redirect("/auth/signin");
    }

    return <OnboardingContent token={authToken.value} />;
}
