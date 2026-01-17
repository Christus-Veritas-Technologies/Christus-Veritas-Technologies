import { prisma } from "@repo/db";
import { hashPassword, verifyPassword, validatePasswordStrength } from "./password";
import { generateTokenPair, generateRandomToken, verifyRefreshToken, type TokenPair } from "./jwt";
import { randomBytes } from "crypto";

export interface SignUpInput {
  email: string;
  password: string;
  name?: string;
  phoneNumber?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
    emailVerified: boolean;
    onboardingCompleted: boolean;
  };
  tokens?: TokenPair;
  error?: string;
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Register a new user
 */
export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const { email, password, name, phoneNumber } = input;

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: passwordValidation.errors.join(", "),
    };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return {
      success: false,
      error: "A user with this email already exists",
    };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user and account
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      phoneNumber,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: email.toLowerCase(),
          password: passwordHash,
        },
      },
    },
  });

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

  // Generate tokens
  const tokens = generateTokenPair(user, session.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      emailVerified: !!user.emailVerified,
      onboardingCompleted: user.onboardingCompleted,
    },
    tokens,
  };
}

/**
 * Sign in an existing user
 */
export async function signIn(input: SignInInput): Promise<AuthResult> {
  const { email, password } = input;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      accounts: {
        where: { providerId: "credentials" },
      },
    },
  });

  if (!user || user.accounts.length === 0) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  const account = user.accounts[0]!;
  if (!account.password) {
    return {
      success: false,
      error: "Invalid email or password",
    };
  }

  // Verify password
  const isValid = await verifyPassword(password, account.password);
  if (!isValid) {
    return {
      success: false,
      error: "Invalid email or password",
    };
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

  // Generate tokens
  const tokens = generateTokenPair(user, session.id);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      emailVerified: !!user.emailVerified,
      onboardingCompleted: user.onboardingCompleted,
    },
    tokens,
  };
}

/**
 * Sign out - invalidate session
 */
export async function signOut(sessionId: string): Promise<void> {
  await prisma.session.delete({
    where: { id: sessionId },
  }).catch(() => {
    // Session might already be deleted
  });
}

/**
 * Refresh access token using refresh token
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResult> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return {
      success: false,
      error: "Invalid refresh token",
    };
  }

  // Check if session exists and is valid
  const session = await prisma.session.findUnique({
    where: { id: payload.tokenId },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    return {
      success: false,
      error: "Session expired",
    };
  }

  // Extend session
  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.session.update({
    where: { id: session.id },
    data: { expiresAt: newExpiresAt },
  });

  // Generate new tokens
  const tokens = generateTokenPair(session.user, session.id);

  return {
    success: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      isAdmin: session.user.isAdmin,
      emailVerified: !!session.user.emailVerified,
      onboardingCompleted: session.user.onboardingCompleted,
    },
    tokens,
  };
}

/**
 * Request password reset - generates reset token
 */
export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  resetToken?: string;
  error?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Generate reset token
  const resetToken = generateRandomToken(48);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // Store in verification table
  await prisma.verification.create({
    data: {
      identifier: email.toLowerCase(),
      value: resetToken,
      expiresAt,
    },
  });

  return {
    success: true,
    resetToken, // In production, send this via email instead of returning
  };
}

/**
 * Reset password using reset token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<ResetPasswordResult> {
  // Validate password strength
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: passwordValidation.errors.join(", "),
    };
  }

  // Find verification record
  const verification = await prisma.verification.findFirst({
    where: {
      value: token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verification) {
    return {
      success: false,
      error: "Invalid or expired reset token",
    };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: verification.identifier },
    include: {
      accounts: {
        where: { providerId: "credentials" },
      },
    },
  });

  if (!user) {
    return {
      success: false,
      error: "User not found",
    };
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update or create credentials account
  if (user.accounts.length > 0) {
    await prisma.account.update({
      where: { id: user.accounts[0]!.id },
      data: { password: passwordHash },
    });
  } else {
    await prisma.account.create({
      data: {
        userId: user.id,
        providerId: "credentials",
        accountId: user.email,
        password: passwordHash,
      },
    });
  }

  // Delete verification token
  await prisma.verification.delete({
    where: { id: verification.id },
  });

  // Invalidate all existing sessions
  await prisma.session.deleteMany({
    where: { userId: user.id },
  });

  return { success: true };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phoneNumber: true,
      isAdmin: true,
      emailVerified: true,
      onboardingCompleted: true,
      image: true,
      createdAt: true,
    },
  });
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string): Promise<ResetPasswordResult> {
  const verification = await prisma.verification.findFirst({
    where: {
      value: token,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verification) {
    return {
      success: false,
      error: "Invalid or expired verification token",
    };
  }

  await prisma.user.update({
    where: { email: verification.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verification.delete({
    where: { id: verification.id },
  });

  return { success: true };
}

/**
 * Request email verification
 */
export async function requestEmailVerification(email: string): Promise<{
  success: boolean;
  verificationToken?: string;
}> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return { success: true };
  }

  const verificationToken = generateRandomToken(48);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.verification.create({
    data: {
      identifier: email.toLowerCase(),
      value: verificationToken,
      expiresAt,
    },
  });

  return {
    success: true,
    verificationToken, // In production, send via email
  };
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(userId: string, data: {
  name?: string;
  phoneNumber?: string;
  businessName?: string;
  businessAddress?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        businessName: data.businessName,
        businessAddress: data.businessAddress,
        onboardingCompleted: true,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to complete onboarding" };
  }
}
