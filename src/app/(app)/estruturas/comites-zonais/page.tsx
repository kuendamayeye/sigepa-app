"use client";

import { CrudListPage } from "@/components/crud/crud-list-page";
import { committeeFields } from "@/components/estruturas/committee-fields";
import { useComitesZonais } from "@/hooks/useEstruturas";
import { useComunas, useMunicipios, useProvincias } from "@/hooks/useGeografia";
import type { Committee } from "@/types";

export default function ComitesZonaisPage() {
  const comites = useComitesZonais();
  const provincias = useProvincias();
  const municipios = useMunicipios();
  const comunas = useComunas();

  return (
    <CrudListPage<Committee>
      title="Comitês zonais"
      description="Comitês de âmbito zonal"
      query={comites.list}
      actions={comites}
      createPermission="structures.create"
      editPermission="structures.edit"
      deletePermission="structures.delete"
      createLabel="Novo comité"
      columns={[
        { key: "name", label: "Nome" },
        { key: "description", label: "Descrição" },
        { key: "memberCount", label: "Membros" },
      ]}
      fields={committeeFields(
        provincias.data ?? [],
        municipios.data ?? [],
        comunas.data ?? []
      )}
    />
  );
}
