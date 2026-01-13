import { auth } from "./config";

/**
 * Server-side authentication utilities
 */

export async function getServerSession(headers: Headers) {
  const session = await auth.api.getSession({ headers });
  return session;
}

export async function validateSession(token: string) {
  // Direct session validation if needed
  const session = await auth.api.getSession({
    headers: new Headers({ cookie: `session=${token}` }),
  });
  return session;
}

export { auth } from "./config";
