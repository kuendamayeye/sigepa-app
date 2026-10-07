"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useEstruturas } from "@/hooks/useEstruturas";
import type { Structure } from "@/types";

export default function EstruturasPage() {
  const estruturas = useEstruturas();

  return (
    <CrudListPage<Structure>
      title="Estruturas"
      description="Estruturas de apoio à organização. Use o menu lateral para núcleos e comités."
      query={estruturas.list}
      actions={estruturas}
      createPermission="structures.create"
      editPermission="structures.edit"
      deletePermission="structures.delete"
      createLabel="Nova estrutura"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        { key: "memberCount", label: "Membros" },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
      ]}
    />
  );
}
