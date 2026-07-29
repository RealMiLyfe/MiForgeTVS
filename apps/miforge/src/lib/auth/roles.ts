import type { User, UserRole } from "@/lib/supabase/types";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  client: 1,
  operator: 2,
  admin: 3,
};

export function getUserRole(user: User | null): UserRole | null {
  return user?.role ?? null;
}

export function requireRole(user: User | null, minRole: UserRole): void {
  if (!user) throw new Error("Authentication required");
  if (ROLE_HIERARCHY[user.role] < ROLE_HIERARCHY[minRole]) {
    throw new Error(`Insufficient permissions. Required: ${minRole}`);
  }
}

export function isOperator(user: User | null): boolean {
  if (!user) return false;
  return user.role === "operator" || user.role === "admin";
}

export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === "admin";
}

export function hasMinRole(user: User | null, minRole: UserRole): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole];
}
