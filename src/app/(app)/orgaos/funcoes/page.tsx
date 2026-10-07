"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useFuncoes, useTiposOrgao } from "@/hooks/useOrgaos";
import type { Function_ } from "@/types";

export default function FuncoesPage() {
  const funcoes = useFuncoes();
  const tipos = useTiposOrgao();

  const tipoOptions = (tipos.list.data ?? []).map((t) => ({ value: t.id, label: t.name }));

  return (
    <CrudListPage<Function_>
      title="Funções"
      description="Funções exercidas dentro dos órgãos"
      query={funcoes.list}
      actions={funcoes}
      createPermission="bodies.create"
      editPermission="bodies.edit"
      deletePermission="bodies.delete"
      createLabel="Nova função"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        { key: "bodyType", label: "Tipo de órgão", render: (row) => row.bodyType?.name ?? "—" },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        { name: "bodyTypeId", label: "Tipo de órgão", type: "select", options: tipoOptions },
      ]}
    />
  );
}
