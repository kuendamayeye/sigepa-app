"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useTiposOrgao } from "@/hooks/useOrgaos";
import type { BodyType } from "@/types";

export default function TiposOrgaoPage() {
  const tipos = useTiposOrgao();

  return (
    <CrudListPage<BodyType>
      title="Tipos de órgão"
      description="Categorias de órgãos (ex.: Direção, Consultivo)"
      query={tipos.list}
      actions={tipos}
      createPermission="bodies.create"
      editPermission="bodies.edit"
      deletePermission="bodies.delete"
      createLabel="Novo tipo"
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
