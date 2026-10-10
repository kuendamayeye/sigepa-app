"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  formacoesService,
  idiomasService,
  linguasService,
  usuariosService,
  type CatalogService,
} from "@/services/administrativo";
import { useCrud } from "@/hooks/useCrud";
import { getApiErrorMessage, toList } from "@/lib/utils";
import type { Idiom, Training, User } from "@/types";

export function useUsuarios() {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["users"],
    queryFn: () => usuariosService.findAll(),
    select: (res) => toList<User>(res),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

  const create = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role: string }) =>
      usuariosService.create(data),
    onSuccess: () => {
      toast.success("Usuário criado com sucesso.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      usuariosService.update(id, data),
    onSuccess: () => {
      toast.success("Usuário atualizado com sucesso.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => usuariosService.remove(id),
    onSuccess: () => {
      toast.success("Usuário removido com sucesso.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const activate = useMutation({
    mutationFn: (id: string) => usuariosService.activate(id),
    onSuccess: () => {
      toast.success("Usuário ativado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => usuariosService.deactivate(id),
    onSuccess: () => {
      toast.success("Usuário desativado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { list, create, update, remove, activate, deactivate };
}

export function useUsuario(id?: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => usuariosService.findById(id as string),
    enabled: !!id,
  });
}

type CatalogInput = { name: string; description?: string };

function useCatalog(service: CatalogService, queryKey: string, label: string) {
  const list = useQuery({
    queryKey: [queryKey],
    queryFn: () => service.findAll(),
    select: (res) => toList<Idiom>(res),
  });

  const crud = useCrud<CatalogInput>(service, queryKey, {
    create: `${label} criado(a) com sucesso.`,
    update: `${label} atualizado(a) com sucesso.`,
    remove: `${label} removido(a) com sucesso.`,
  });

  return { list, ...crud };
}

export function useIdiomas() {
  return useCatalog(idiomasService, "idioms", "Idioma");
}

export function useIdioma(id?: string) {
  return useQuery({
    queryKey: ["idiom", id],
    queryFn: () => idiomasService.findById(id as string),
    enabled: !!id,
  });
}

export function useLinguas() {
  return useCatalog(linguasService, "languages", "Língua");
}

export function useLingua(id?: string) {
  return useQuery({
    queryKey: ["language", id],
    queryFn: () => linguasService.findById(id as string),
    enabled: !!id,
  });
}

export function useFormacoes() {
  const list = useQuery({
    queryKey: ["trainings"],
    queryFn: () => formacoesService.findAll(),
    select: (res) => toList<Training>(res),
  });

  const crud = useCrud<CatalogInput>(formacoesService, "trainings", {
    create: "Formação criada com sucesso.",
    update: "Formação atualizada com sucesso.",
    remove: "Formação removida com sucesso.",
  });

  return { list, ...crud };
}

export function useFormacao(id?: string) {
  return useQuery({
    queryKey: ["training", id],
    queryFn: () => formacoesService.findById(id as string),
    enabled: !!id,
  });
}
