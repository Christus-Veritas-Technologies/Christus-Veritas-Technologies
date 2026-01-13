import type { User, OrganizationMember, MemberRole } from "@repo/db";

/**
 * Permission definitions for RBAC
 */
export const permissions = {
  // Organization management
  "org:read": ["OWNER", "ADMIN", "MEMBER", "BILLING"],
  "org:update": ["OWNER", "ADMIN"],
  "org:delete": ["OWNER"],

  // Member management
  "members:read": ["OWNER", "ADMIN", "MEMBER"],
  "members:invite": ["OWNER", "ADMIN"],
  "members:remove": ["OWNER", "ADMIN"],
  "members:update-role": ["OWNER"],

  // Billing
  "billing:read": ["OWNER", "ADMIN", "BILLING"],
  "billing:pay": ["OWNER", "ADMIN", "BILLING"],
  "billing:manage": ["OWNER", "ADMIN"],

  // Services
  "services:read": ["OWNER", "ADMIN", "MEMBER"],
  "services:manage": ["OWNER", "ADMIN"],

  // API Keys
  "api-keys:read": ["OWNER", "ADMIN"],
  "api-keys:create": ["OWNER", "ADMIN"],
  "api-keys:revoke": ["OWNER", "ADMIN"],

  // Support
  "support:read": ["OWNER", "ADMIN", "MEMBER"],
  "support:create": ["OWNER", "ADMIN", "MEMBER"],
} as const;

export type Permission = keyof typeof permissions;
export type Role = MemberRole;

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = permissions[permission];
  return (allowedRoles as readonly string[]).includes(role);
}

/**
 * Check if a user is a system admin (CVT staff)
 */
export function isSystemAdmin(user: Pick<User, "isAdmin">): boolean {
  return user.isAdmin === true;
}

/**
 * Check if a user can access an organization
 */
export function canAccessOrganization(
  user: Pick<User, "isAdmin">,
  membership?: Pick<OrganizationMember, "organizationId"> | null
): boolean {
  // System admins can access all orgs
  if (isSystemAdmin(user)) return true;

  // Otherwise, must be a member
  return membership !== null && membership !== undefined;
}

/**
 * Get the highest role a user has in an organization
 */
export function getUserRole(
  membership?: Pick<OrganizationMember, "role"> | null
): Role | null {
  return membership?.role ?? null;
}

/**
 * Require a specific permission, throw if not allowed
 */
export function requirePermission(role: Role | null, permission: Permission): void {
  if (!role || !hasPermission(role, permission)) {
    throw new Error(`Permission denied: ${permission}`);
  }
}
