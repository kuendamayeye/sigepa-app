import type { FormFieldDef } from "@/components/crud/crud-list-page";
import type { Commune, Municipality, Province } from "@/types";

/** Campos comuns aos formulários de comitês (província/município/comuna). */
export function committeeFields(
  provinces: Province[],
  municipalities: Municipality[],
  communes: Commune[]
): FormFieldDef[] {
  return [
    { name: "name", label: "Nome", required: true },
    { name: "description", label: "Descrição", type: "textarea" },
    {
      name: "provinceId",
      label: "Província",
      type: "select",
      options: provinces.map((p) => ({ value: p.id, label: p.name })),
    },
    {
      name: "municipalityId",
      label: "Município",
      type: "select",
      options: municipalities.map((m) => ({ value: m.id, label: m.name })),
    },
    {
      name: "communeId",
      label: "Comuna",
      type: "select",
      options: communes.map((c) => ({ value: c.id, label: c.name })),
    },
  ];
}
