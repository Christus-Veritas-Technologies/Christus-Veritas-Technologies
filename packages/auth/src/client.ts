import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

/**
 * Client-side authentication utilities
 */
export function createClient(baseURL: string) {
  return createAuthClient({
    baseURL,
    plugins: [organizationClient()],
  });
}

// Default client for browser usage
export const authClient =
  typeof window !== "undefined"
    ? createClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
    : null;
