import { prisma } from "@repo/db";
import { generateTokenPair, type TokenPair } from "./jwt";
import { randomBytes } from "crypto";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/api/auth/google/callback";

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface GoogleAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
    image: string | null;
  };
  tokens?: TokenPair;
  error?: string;
  isNewUser?: boolean;
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
  });

  if (state) {
    params.append("state", state);
  }

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGoogleCode(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  id_token: string;
  expires_in: number;
} | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      console.error("Google token exchange failed:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Google token exchange error:", error);
    return null;
  }
}

/**
 * Get user info from Google
 */
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  try {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to get Google user info:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Google user info error:", error);
    return null;
  }
}

/**
 * Sign in or sign up with Google OAuth
 */
export async function signInWithGoogle(code: string): Promise<GoogleAuthResult> {
  // Exchange code for tokens
  const tokenData = await exchangeGoogleCode(code);
  if (!tokenData) {
    return {
      success: false,
      error: "Failed to exchange authorization code",
    };
  }

  // Get user info from Google
  const googleUser = await getGoogleUserInfo(tokenData.access_token);
  if (!googleUser) {
    return {
      success: false,
      error: "Failed to get user info from Google",
    };
  }

  // Check if user already exists with this email
  let user = await prisma.user.findUnique({
    where: { email: googleUser.email.toLowerCase() },
    include: {
      accounts: {
        where: { providerId: "google" },
      },
    },
  });

  let isNewUser = false;

  if (!user) {
    // Create new user
    isNewUser = true;
    user = await prisma.user.create({
      data: {
        email: googleUser.email.toLowerCase(),
        name: googleUser.name,
        image: googleUser.picture,
        emailVerified: googleUser.verified_email ? new Date() : null,
        accounts: {
          create: {
            providerId: "google",
            accountId: googleUser.id,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
          },
        },
      },
      include: {
        accounts: {
          where: { providerId: "google" },
        },
      },
    });
  } else {
    // Check if Google account is linked
    const googleAccount = user.accounts.find(a => a.providerId === "google");
    
    if (!googleAccount) {
      // Link Google account to existing user
      await prisma.account.create({
        data: {
          userId: user.id,
          providerId: "google",
          accountId: googleUser.id,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        },
      });
    } else {
      // Update existing Google account tokens
      await prisma.account.update({
        where: { id: googleAccount.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || googleAccount.refreshToken,
          accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        },
      });
    }

    // Update user profile if needed
    if (googleUser.picture && !user.image) {
      await prisma.user.update({
        where: { id: user.id },
        data: { image: googleUser.picture },
      });
    }
  }

  // Create session
  const sessionToken = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      token: sessionToken,
      expiresAt,
    },
  });

  // Generate JWT tokens
  const tokens = generateTokenPair(user, session.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      image: user.image,
    },
    tokens,
    isNewUser,
  };
}

/**
 * Unlink Google account from user
 */
export async function unlinkGoogleAccount(userId: string): Promise<{ success: boolean; error?: string }> {
  // Check if user has other sign-in methods
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { accounts: true },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const googleAccount = user.accounts.find(a => a.providerId === "google");
  if (!googleAccount) {
    return { success: false, error: "Google account not linked" };
  }

  // Check if user has password-based auth
  const hasPasswordAuth = user.accounts.some(a => a.providerId === "credentials" && a.password);
  
  if (!hasPasswordAuth && user.accounts.length <= 1) {
    return {
      success: false,
      error: "Cannot unlink Google account. Please set a password first.",
    };
  }

  await prisma.account.delete({
    where: { id: googleAccount.id },
  });

  return { success: true };
}

/**
 * Check if Google OAuth is configured
 */
export function isGoogleOAuthConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}
