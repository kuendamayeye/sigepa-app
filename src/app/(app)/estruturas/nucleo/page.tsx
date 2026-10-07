"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { useComitesLocais, useNucleos } from "@/hooks/useEstruturas";
import type { Core } from "@/types";

export default function NucleosPage() {
  const nucleos = useNucleos();
  const comitesLocais = useComitesLocais();

  const comiteOptions = (comitesLocais.list.data ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <CrudListPage<Core>
      title="Núcleos"
      description="Núcleos de base ligados aos comités locais"
      query={nucleos.list}
      actions={nucleos}
      createPermission="structures.create"
      editPermission="structures.edit"
      deletePermission="structures.delete"
      createLabel="Novo núcleo"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        { key: "memberCount", label: "Membros" },
        { key: "localCommittee", label: "Comité local", render: (row) => (row as unknown as { localCommittee?: { name: string } }).localCommittee?.name ?? "—" },
      ]}
      fields={[
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        {
          name: "localCommitteeId",
          label: "Comité local",
          type: "select",
          options: comiteOptions,
        },
      ]}
    />
  );
}
