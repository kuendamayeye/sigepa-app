"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/utils";

interface CrudService<TInput> {
  create(dto: TInput): Promise<unknown>;
  update(id: string, dto: TInput): Promise<unknown>;
  remove(id: string): Promise<unknown>;
}

/**
 * Mutações de CRUD reutilizáveis: invalida a lista e mostra toasts padrão.
 */
export function useCrud<TInput>(
  service: CrudService<TInput>,
  queryKey: string,
  messages: { create: string; update: string; remove: string }
) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [queryKey] });

  const create = useMutation({
    mutationFn: (data: TInput) => service.create(data),
    onSuccess: () => {
      toast.success(messages.create);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TInput }) => service.update(id, data),
    onSuccess: () => {
      toast.success(messages.update);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: (id: string) => service.remove(id),
    onSuccess: () => {
      toast.success(messages.remove);
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { create, update, remove };
}
