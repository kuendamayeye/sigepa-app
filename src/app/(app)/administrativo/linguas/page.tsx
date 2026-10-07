"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useLinguas } from "@/hooks/useAdministrativo";
import type { Language } from "@/types";

export default function LinguasPage() {
  const linguas = useLinguas();

  return (
    <CrudListPage<Language>
      title="Línguas"
      description="Línguas oficiais e regionais"
      query={linguas.list}
      actions={linguas}
      createPermission="admin.edit"
      editPermission="admin.edit"
      deletePermission="admin.edit"
      createLabel="Nova língua"
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
