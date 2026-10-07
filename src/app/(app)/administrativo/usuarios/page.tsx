"use client";

import { UserCheck, UserX } from "lucide-react";
import { CrudListPage } from "@/components/crud/crud-list-page";
import { useUsuarios } from "@/hooks/useAdministrativo";
import { Badge } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "operador", label: "Operador" },
  { value: "visualizador", label: "Visualizador" },
];

const ROLE_LABELS = Object.fromEntries(ROLE_OPTIONS.map((o) => [o.value, o.label]));

export default function UsuariosPage() {
  const usuarios = useUsuarios();

  return (
    <CrudListPage<User>
      title="Usuários"
      description="Contas de acesso ao sistema (apenas administradores)"
      query={usuarios.list}
      actions={usuarios}
      createPermission="users.manage"
      editPermission="users.manage"
      deletePermission="users.manage"
      createLabel="Novo usuário"
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        {
          key: "role",
          label: "Papel",
          render: (row) => <Badge color="blue">{ROLE_LABELS[row.role] ?? row.role}</Badge>,
        },
        {
          key: "isActive",
          label: "Estado",
          render: (row) =>
            row.isActive === false ? (
              <Badge color="red">Inativo</Badge>
            ) : (
              <Badge color="green">Ativo</Badge>
            ),
        },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "email", label: "E-mail", required: true },
        {
          name: "password",
          label: "Senha",
          type: "text",
          required: true,
          hideOnEdit: true,
          placeholder: "Mínimo 6 caracteres",
        },
        { name: "role", label: "Papel", type: "select", required: true, options: ROLE_OPTIONS },
      ]}
      extraActions={(row) => (
        <Button
          variant="ghost"
          size="sm"
          title={row.isActive === false ? "Ativar" : "Desativar"}
          onClick={() =>
            row.isActive === false
              ? usuarios.activate.mutate(row.id)
              : usuarios.deactivate.mutate(row.id)
          }
        >
          {row.isActive === false ? (
            <UserCheck className="h-4 w-4 text-green-600" />
          ) : (
            <UserX className="h-4 w-4 text-amber-600" />
          )}
        </Button>
      )}
    />
  );
}
