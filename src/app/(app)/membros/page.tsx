"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2, UserCheck, UserX, Eye } from "lucide-react";
import { useMembros } from "@/hooks/useMembros";
import { usePermission } from "@/hooks/usePermission";
import { PageHeader, Pagination } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/modal";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { formatDate } from "@/lib/utils";
import type { Member } from "@/types";

const PAGE_SIZE = 20;

export default function MembrosPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<Member | null>(null);

  const canEdit = usePermission("members.edit");
  const canDelete = usePermission("members.delete");

  const { list, remove, activate, deactivate } = useMembros();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (list.data ?? []).filter((m) => {
      const matchesSearch =
        !term ||
        m.fullName?.toLowerCase().includes(term) ||
        m.bi?.toLowerCase().includes(term) ||
        m.email?.toLowerCase().includes(term);
      const matchesStatus = !status || m.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [list.data, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Membros"
        description="Listagem e gestão de membros"
        action={
          <Link href="/membros/novo">
            <Button>
              <Plus className="h-4 w-4" />
              Novo membro
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Pesquisar por nome, BI ou e-mail..."
          className="max-w-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Select
          className="w-44"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos os estados</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </Select>
      </div>

      {list.isLoading && <LoadingState />}
      {list.isError && <ErrorState onRetry={() => list.refetch()} />}
      {!list.isLoading && !list.isError && rows.length === 0 && <EmptyState />}

      {!list.isLoading && !list.isError && rows.length > 0 && (
        <>
          <Table>
            <THead>
              <tr>
                <TH>Nome</TH>
                <TH>BI</TH>
                <TH>Telefone</TH>
                <TH>Estado</TH>
                <TH>Criado em</TH>
                <TH className="text-right">Ações</TH>
              </tr>
            </THead>
            <TBody>
              {rows.map((m) => (
                <TR key={m.id}>
                  <TD className="font-medium text-zinc-900">{m.fullName}</TD>
                  <TD>{m.bi || "—"}</TD>
                  <TD>{m.phoneNumber || "—"}</TD>
                  <TD>
                    <Badge color={m.status !== "inactive" ? "green" : "red"}>
                      {m.status !== "inactive" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TD>
                  <TD>{formatDate(m.createdAt)}</TD>
                  <TD>
                    <div className="flex justify-end gap-1">
                      <Link href={`/membros/${m.id}`}>
                        <Button variant="ghost" size="sm" title="Ver detalhe">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {canEdit && (
                        <>
                          <Link href={`/membros/${m.id}/editar`}>
                            <Button variant="ghost" size="sm" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            title={m.status !== "inactive" ? "Desativar" : "Ativar"}
                            onClick={() =>
                              m.status !== "inactive"
                                ? deactivate.mutate(m.id)
                                : activate.mutate(m.id)
                            }
                          >
                            {m.status !== "inactive" ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Remover"
                          onClick={() => setToDelete(m)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Remover membro"
        message={`Tem a certeza que deseja remover "${toDelete?.fullName}"? Esta acção não pode ser desfeita.`}
        confirmLabel="Remover"
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          remove.mutate(toDelete.id, { onSuccess: () => setToDelete(null) });
        }}
      />
    </div>
  );
}
