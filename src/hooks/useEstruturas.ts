"use client";

import { useQuery } from "@tanstack/react-query";
import {
  comitesLocaisService,
  comitesSectoriaisService,
  comitesZonaisService,
  estruturasService,
  nucleosService,
} from "@/services/estruturas";
import { useCrud } from "@/hooks/useCrud";
import { toList } from "@/lib/utils";
import type { Committee, Core, Structure } from "@/types";

const structureMessages = {
  create: "Estrutura criada com sucesso.",
  update: "Estrutura atualizada com sucesso.",
  remove: "Estrutura removida com sucesso.",
};

const coreMessages = {
  create: "Núcleo criado com sucesso.",
  update: "Núcleo atualizado com sucesso.",
  remove: "Núcleo removido com sucesso.",
};

const localMessages = {
  create: "Comité local criado com sucesso.",
  update: "Comité local atualizado com sucesso.",
  remove: "Comité local removido com sucesso.",
};

const sectorialMessages = {
  create: "Comité sectorial criado com sucesso.",
  update: "Comité sectorial atualizado com sucesso.",
  remove: "Comité sectorial removido com sucesso.",
};

const zonalMessages = {
  create: "Comité zonal criado com sucesso.",
  update: "Comité zonal atualizado com sucesso.",
  remove: "Comité zonal removido com sucesso.",
};

export function useEstruturas() {
  const list = useQuery({
    queryKey: ["structures"],
    queryFn: () => estruturasService.findAll({ includeMemberCount: true }),
    select: (res) => toList<Structure>(res),
  });

  const crud = useCrud<{ name: string; description?: string }>(
    estruturasService,
    "structures",
    structureMessages
  );

  return { list, ...crud };
}

export function useEstrutura(id?: string) {
  return useQuery({
    queryKey: ["structure", id],
    queryFn: () => estruturasService.findById(id as string),
    enabled: !!id,
  });
}

export function useNucleos() {
  const list = useQuery({
    queryKey: ["cores"],
    queryFn: () => nucleosService.findAll({ includeStats: true }),
    select: (res) => toList<Core>(res),
  });

  const crud = useCrud<Record<string, unknown>>(nucleosService, "cores", coreMessages);

  return { list, ...crud };
}

export function useNucleo(id?: string) {
  return useQuery({
    queryKey: ["core", id],
    queryFn: () => nucleosService.findOne(id as string),
    enabled: !!id,
  });
}

export function useComitesLocais() {
  const list = useQuery({
    queryKey: ["local-committees"],
    queryFn: () => comitesLocaisService.findAll(),
    select: (res) => toList<Committee>(res),
  });

  const crud = useCrud<Record<string, unknown>>(
    comitesLocaisService,
    "local-committees",
    localMessages
  );

  return { list, ...crud };
}

export function useComiteLocal(id?: string) {
  return useQuery({
    queryKey: ["local-committee", id],
    queryFn: () => comitesLocaisService.findOne(id as string),
    enabled: !!id,
  });
}

export function useComitesSectoriais() {
  const list = useQuery({
    queryKey: ["sectorial-committees"],
    queryFn: () => comitesSectoriaisService.findAll(),
    select: (res) => toList<Committee>(res),
  });

  const crud = useCrud<Record<string, unknown>>(
    comitesSectoriaisService,
    "sectorial-committees",
    sectorialMessages
  );

  return { list, ...crud };
}

export function useComiteSectorial(id?: string) {
  return useQuery({
    queryKey: ["sectorial-committee", id],
    queryFn: () => comitesSectoriaisService.findOne(id as string),
    enabled: !!id,
  });
}

export function useComitesZonais() {
  const list = useQuery({
    queryKey: ["zonal-committees"],
    queryFn: () => comitesZonaisService.findAll(),
    select: (res) => toList<Committee>(res),
  });

  const crud = useCrud<Record<string, unknown>>(
    comitesZonaisService,
    "zonal-committees",
    zonalMessages
  );

  return { list, ...crud };
}

export function useComiteZonal(id?: string) {
  return useQuery({
    queryKey: ["zonal-committee", id],
    queryFn: () => comitesZonaisService.findOne(id as string),
    enabled: !!id,
  });
}
