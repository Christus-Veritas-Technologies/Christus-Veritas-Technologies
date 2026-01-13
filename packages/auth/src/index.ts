// Auth service exports
export {
  signUp,
  signIn,
  signOut,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  getUserById,
  verifyEmail,
  requestEmailVerification,
  type SignUpInput,
  type SignInInput,
  type AuthResult,
  type ResetPasswordResult,
} from "./auth-service";

// Password utilities
export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
} from "./password";

// JWT utilities
export {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyAccessToken,
  verifyRefreshToken,
  extractBearerToken,
  generateRandomToken,
  type TokenPayload,
  type RefreshTokenPayload,
  type TokenPair,
} from "./jwt";

// RBAC exports
export {
  hasPermission,
  isSystemAdmin,
  canAccessOrganization,
  getUserRole,
  requirePermission,
  permissions,
  type Permission,
  type Role,
} from "./rbac";

// API Key exports
export {
  generateApiKey,
  hashApiKey,
  validateApiKey,
  hasScope,
  API_SCOPES,
  type GeneratedApiKey,
  type ValidatedApiKey,
  type ApiScope,
} from "./api-keys";

// Google OAuth exports
export {
  getGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleUserInfo,
  signInWithGoogle,
  unlinkGoogleAccount,
  isGoogleOAuthConfigured,
  type GoogleUserInfo,
  type GoogleAuthResult,
} from "./google-oauth";
