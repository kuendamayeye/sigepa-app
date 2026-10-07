"use client";

import { useAuth } from "@/context/auth-context";
import type { Permission } from "@/lib/permissions";

/** Uso: const podeCriar = usePermission("members.create"); */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}
