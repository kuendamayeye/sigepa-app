"use client";

import type { ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";
import type { Permission } from "@/lib/permissions";

/**
 * Renderiza o conteúdo apenas se o usuário tiver a permissão.
 * Ex.: <Can permission="members.create"><Button/></Can>
 */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const allowed = usePermission(permission);
  return <>{allowed ? children : fallback}</>;
}
