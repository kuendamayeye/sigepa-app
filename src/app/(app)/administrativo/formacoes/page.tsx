"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useFormacoes } from "@/hooks/useAdministrativo";
import type { Training } from "@/types";

export default function FormacoesPage() {
  const formacoes = useFormacoes();

  return (
    <CrudListPage<Training>
      title="Formações"
      description="Cursos e formações dos membros"
      query={formacoes.list}
      actions={formacoes}
      createPermission="admin.edit"
      editPermission="admin.edit"
      deletePermission="admin.edit"
      createLabel="Nova formação"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        { key: "level", label: "Nível" },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "level", label: "Nível" },
      ]}
    />
  );
}
