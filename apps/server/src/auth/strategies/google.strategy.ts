import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback, Profile } from "passport-google-oauth20";
import { prisma } from "@repo/db";
import { generateTokenPair } from "@repo/auth";
import { randomBytes } from "crypto";

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/api/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  /**
   * Validate Google OAuth callback
   * Creates or updates user based on Google profile
   */
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || profile.name?.givenName || "User";
      const picture = profile.photos?.[0]?.value;

      if (!email) {
        return done(new Error("No email found in Google profile"), undefined);
      }

      // Check if user exists with this Google account
      let user = await prisma.user.findFirst({
        where: {
          accounts: {
            some: {
              providerId: "google",
              accountId: profile.id,
            },
          },
        },
        include: {
          accounts: true,
        },
      });

      if (!user) {
        // Check if user exists with email
        user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            accounts: true,
          },
        });

        if (user) {
          // Link Google account to existing user
          await prisma.account.create({
            data: {
              userId: user.id,
              providerId: "google",
              accountId: profile.id,
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          });
        } else {
          // Create new user with Google account
          user = await prisma.user.create({
            data: {
              email: email.toLowerCase(),
              name,
              image: picture,
              emailVerified: new Date(), // Google emails are verified - set to current date
              accounts: {
                create: {
                  providerId: "google",
                  accountId: profile.id,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                },
              },
            },
            include: {
              accounts: true,
            },
          });
        }
      } else {
        // Update existing user's Google tokens
        await prisma.account.updateMany({
          where: {
            userId: user.id,
            providerId: "google",
          },
          data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        });
      }

      if (!user) {
        return done(new Error("Failed to create or find user"), undefined);
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

      // Return user with tokens
      done(null, {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        emailVerified: !!user.emailVerified,
        onboardingCompleted: user.onboardingCompleted,
        image: user.image,
        tokens,
      });
    } catch (error) {
      done(error as Error, undefined);
    }
  }
}
