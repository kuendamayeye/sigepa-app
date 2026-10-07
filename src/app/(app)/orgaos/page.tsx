"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useOrgaos, useTiposOrgao } from "@/hooks/useOrgaos";
import type { Body } from "@/types";

export default function OrgaosPage() {
  const orgaos = useOrgaos();
  const tipos = useTiposOrgao();

  const tipoOptions = (tipos.list.data ?? []).map((t) => ({ value: t.id, label: t.name }));

  return (
    <CrudListPage<Body>
      title="Órgãos"
      description="Órgãos e estruturas formais da organização"
      query={orgaos.list}
      actions={orgaos}
      createPermission="bodies.create"
      editPermission="bodies.edit"
      deletePermission="bodies.delete"
      createLabel="Novo órgão"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        {
          key: "bodyType",
          label: "Tipo",
          render: (row) => row.bodyType?.name ?? "—",
        },
        {
          key: "isActive",
          label: "Estado",
          render: (row) =>
            row.isActive === false ? (
              <span className="text-red-600">Inativo</span>
            ) : (
              <span className="text-green-600">Ativo</span>
            ),
        },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "bodyTypeId", label: "Tipo de órgão", type: "select", required: true, options: tipoOptions },
      ]}
    />
  );
}
