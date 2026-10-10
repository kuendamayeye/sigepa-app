"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { membrosService, type MemberFilters } from "@/services/membros";
import { useCrud } from "@/hooks/useCrud";
import { getApiErrorMessage, toList } from "@/lib/utils";
import type { Member } from "@/types";

export function useMembros(params?: MemberFilters) {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["members", params ?? {}],
    queryFn: () => membrosService.findAll(params),
    select: (res) => toList<Member>(res),
  });

  const crud = useCrud<Partial<Member>>(membrosService, "members", {
    create: "Membro criado com sucesso.",
    update: "Membro atualizado com sucesso.",
    remove: "Membro removido com sucesso.",
  });

  const invalidateMember = (id: string) => {
    queryClient.invalidateQueries({ queryKey: ["member", id] });
    queryClient.invalidateQueries({ queryKey: ["members"] });
  };

  const activate = useMutation({
    mutationFn: (id: string) => membrosService.activate(id),
    onSuccess: (_data, id) => {
      toast.success("Membro ativado.");
      invalidateMember(id);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => membrosService.deactivate(id),
    onSuccess: (_data, id) => {
      toast.success("Membro desativado.");
      invalidateMember(id);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { list, ...crud, activate, deactivate };
}

export function useMembro(id?: string) {
  return useQuery({
    queryKey: ["member", id],
    queryFn: () => membrosService.findById(id as string),
    enabled: !!id,
  });
}
