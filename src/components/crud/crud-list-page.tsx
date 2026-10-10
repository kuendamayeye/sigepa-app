"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader, Pagination } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ConfirmDialog, Modal } from "@/components/ui/modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { usePermission } from "@/hooks/usePermission";
import type { Permission } from "@/lib/permissions";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Resolver } from "react-hook-form";

export interface FormFieldDef {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "checkbox";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** Para selects dependentes: calcula as opções a partir dos valores do form. */
  loadOptions?: (values: Record<string, string>) => { value: string; label: string }[];
  /** Ex.: senha — só aparece na criação. */
  hideOnEdit?: boolean;
}

export interface ColumnDef<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

// Fronteira flexível com as mutações do React Query (parâmetros verificados
// no hook de origem; aqui apenas precisamos de mutate + isPending).
interface Mutations {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: { mutate: (data: any, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update: { mutate: (vars: any, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove: { mutate: (id: any, opts?: { onSuccess?: () => void }) => void; isPending: boolean };
}

interface Identifiable {
  id: string | number;
}

/**
 * Página de CRUD genérica para entidades simples (catálogos e estruturas):
 * lista + pesquisa + paginação + criar/editar em modal + remover com confirmação.
 */
export function CrudListPage<T extends Identifiable>({
  title,
  description,
  columns,
  fields,
  query,
  actions,
  createPermission,
  editPermission,
  deletePermission,
  createLabel = "Novo registo",
  extraActions,
}: {
  title: string;
  description?: string;
  columns: ColumnDef<T>[];
  fields: FormFieldDef[];
  query: UseQueryResult<T[]>;
  actions: Mutations;
  createPermission: Permission;
  editPermission: Permission;
  deletePermission: Permission;
  createLabel?: string;
  extraActions?: (row: T) => ReactNode;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<T | null>(null);

  const canCreate = usePermission(createPermission);
  const canEdit = usePermission(editPermission);
  const canDelete = usePermission(deletePermission);

  const schema = useMemo(() => {
    const shape: Record<string, z.ZodType> = {};
    for (const field of fields) {
      if (field.type === "checkbox") {
        shape[field.name] = z.boolean().optional();
      } else if (field.required) {
        shape[field.name] = z.string().min(1, `${field.label} é obrigatório`);
      } else {
        shape[field.name] = z.string().optional();
      }
    }
    return z.object(shape);
  }, [fields]);

  type FormData = Record<string, string | boolean>;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) as unknown as Resolver<FormData> });

  const values = watch();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return query.data ?? [];
    return (query.data ?? []).filter((row) =>
      Object.values(row).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(term)
      )
    );
  }, [query.data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / 20));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * 20, currentPage * 20);

  function openCreate() {
    reset(
      Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? false : ""]))
    );
    setCreating(true);
  }

  function openEdit(row: T) {
    reset(
      Object.fromEntries(
        fields.map((f) => [
          f.name,
          f.type === "checkbox" ? Boolean((row as Record<string, unknown>)[f.name]) : ((row as Record<string, unknown>)[f.name] as string) ?? "",
        ])
      )
    );
    setEditing(row);
  }

  function closeModal() {
    setCreating(false);
    setEditing(null);
  }

  function onSubmit(data: FormData) {
    const done = () => closeModal();
    if (editing) {
      actions.update.mutate({ id: editing.id, data }, { onSuccess: done });
    } else {
      actions.create.mutate(data, { onSuccess: done });
    }
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        action={
          canCreate ? (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              {createLabel}
            </Button>
          ) : undefined
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Pesquisar..."
          className="max-w-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {query.isLoading && <LoadingState />}
      {query.isError && <ErrorState onRetry={() => query.refetch()} />}
      {!query.isLoading && !query.isError && rows.length === 0 && <EmptyState />}

      {!query.isLoading && !query.isError && rows.length > 0 && (
        <>
          <Table>
            <THead>
              <tr>
                {columns.map((col) => (
                  <TH key={col.key}>{col.label}</TH>
                ))}
                {(canEdit || canDelete) && <TH className="text-right">Ações</TH>}
              </tr>
            </THead>
            <TBody>
              {rows.map((row) => (
                <TR key={row.id}>
                  {columns.map((col) => (
                    <TD key={col.key}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </TD>
                  ))}
                  {(canEdit || canDelete) && (
                    <TD>
                      <div className="flex justify-end gap-1">
                        {extraActions?.(row)}
                        {canEdit && (
                          <Button variant="ghost" size="sm" title="Editar" onClick={() => openEdit(row)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Remover"
                            onClick={() => setToDelete(row)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TD>
                  )}
                </TR>
              ))}
            </TBody>
          </Table>
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={creating || !!editing}
        onClose={closeModal}
        title={editing ? `Editar — ${title}` : `Novo registo — ${title}`}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {fields
            .filter((field) => !(field.hideOnEdit && editing))
            .map((field) => {
            const error = errors[field.name]?.message as string | undefined;
            const fieldOptions =
              field.loadOptions?.(values as Record<string, string>) ?? field.options;

            if (field.type === "checkbox") {
              return (
                <label key={field.name} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    {...register(field.name)}
                  />
                  {field.label}
                </label>
              );
            }

            return (
              <Field
                key={field.name}
                label={field.label}
                htmlFor={field.name}
                error={error}
                required={field.required}
              >
                {field.type === "textarea" ? (
                  <Textarea id={field.name} {...register(field.name)} />
                ) : field.type === "select" ? (
                  <Select id={field.name} {...register(field.name)}>
                    <option value="">{field.placeholder ?? "Selecione..."}</option>
                    {fieldOptions?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    {...register(field.name)}
                  />
                )}
              </Field>
            );
          })}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={actions.create.isPending || actions.update.isPending}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Remover registo"
        message={`Tem a certeza que deseja remover "${
          toDelete ? String((toDelete as Record<string, unknown>).name ?? toDelete.id) : ""
        }"? Esta acção não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={actions.remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          actions.remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
        }}
      />
    </div>
  );
}
