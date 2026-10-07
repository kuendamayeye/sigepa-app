"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useIdiomas } from "@/hooks/useAdministrativo";
import type { Idiom } from "@/types";

export default function IdiomasPage() {
  const idiomas = useIdiomas();

  return (
    <CrudListPage<Idiom>
      title="Idiomas"
      description="Idiomas falados pelos membros"
      query={idiomas.list}
      actions={idiomas}
      createPermission="admin.edit"
      editPermission="admin.edit"
      deletePermission="admin.edit"
      createLabel="Novo idioma"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
      ]}
    />
  );
}
