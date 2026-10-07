"use client";

import { useQuery } from "@tanstack/react-query";
import { funcoesService, orgaosService, tiposOrgaoService } from "@/services/orgaos";
import { useCrud } from "@/hooks/useCrud";
import { toList } from "@/lib/utils";
import type { Body, BodyType, Function_ } from "@/types";

export function useOrgaos(params?: { bodyTypeId?: string }) {
  const list = useQuery({
    queryKey: ["bodies", params ?? {}],
    queryFn: () => orgaosService.findAll(params),
    select: (res) => toList<Body>(res),
  });

  const crud = useCrud<{ name: string; description?: string; bodyTypeId?: string }>(
    orgaosService,
    "bodies",
    {
      create: "Órgão criado com sucesso.",
      update: "Órgão atualizado com sucesso.",
      remove: "Órgão removido com sucesso.",
    }
  );

  return { list, ...crud };
}

export function useOrgao(id?: string) {
  return useQuery({
    queryKey: ["body", id],
    queryFn: () => orgaosService.findById(id as string),
    enabled: !!id,
  });
}

export function useTiposOrgao() {
  const list = useQuery({
    queryKey: ["body-types"],
    queryFn: () => tiposOrgaoService.findAll(),
    select: (res) => toList<BodyType>(res),
  });

  const crud = useCrud<{ name: string; description?: string }>(
    tiposOrgaoService,
    "body-types",
    {
      create: "Tipo de órgão criado com sucesso.",
      update: "Tipo de órgão atualizado com sucesso.",
      remove: "Tipo de órgão removido com sucesso.",
    }
  );

  return { list, ...crud };
}

export function useTipoOrgao(id?: string) {
  return useQuery({
    queryKey: ["body-type", id],
    queryFn: () => tiposOrgaoService.findById(id as string),
    enabled: !!id,
  });
}

export function useFuncoes(params?: { bodyTypeId?: string }) {
  const list = useQuery({
    queryKey: ["functions", params ?? {}],
    queryFn: () => funcoesService.findAll(params),
    select: (res) => toList<Function_>(res),
  });

  const crud = useCrud<{ name: string; description?: string; bodyTypeId?: string }>(
    funcoesService,
    "functions",
    {
      create: "Função criada com sucesso.",
      update: "Função atualizada com sucesso.",
      remove: "Função removida com sucesso.",
    }
  );

  return { list, ...crud };
}

export function useFuncao(id?: string) {
  return useQuery({
    queryKey: ["function", id],
    queryFn: () => funcoesService.findById(id as string),
    enabled: !!id,
  });
}
