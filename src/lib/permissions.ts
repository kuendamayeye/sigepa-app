import type { Role } from "@/types";

export type Permission =
  | "dashboard.view"
  | "members.view"
  | "members.create"
  | "members.edit"
  | "members.delete"
  | "bodies.view"
  | "bodies.create"
  | "bodies.edit"
  | "bodies.delete"
  | "structures.view"
  | "structures.create"
  | "structures.edit"
  | "structures.delete"
  | "admin.view"
  | "admin.edit"
  | "users.manage";

/**
 * Matriz de permissões por role.
 * Para adicionar um novo role ou permissão, basta alterar este arquivo.
 */
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "dashboard.view",
    "members.view",
    "members.create",
    "members.edit",
    "members.delete",
    "bodies.view",
    "bodies.create",
    "bodies.edit",
    "bodies.delete",
    "structures.view",
    "structures.create",
    "structures.edit",
    "structures.delete",
    "admin.view",
    "admin.edit",
    "users.manage",
  ],
  operador: [
    "dashboard.view",
    "members.view",
    "members.create",
    "members.edit",
    "members.delete",
    "bodies.view",
    "bodies.create",
    "bodies.edit",
    "bodies.delete",
    "structures.view",
    "structures.create",
    "structures.edit",
    "structures.delete",
    "admin.view",
    "admin.edit",
  ],
  visualizador: [
    "dashboard.view",
    "members.view",
    "bodies.view",
    "structures.view",
    "admin.view",
  ],
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return permissions.includes(permission);
}
