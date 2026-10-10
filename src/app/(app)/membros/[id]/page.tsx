"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { useMembro } from "@/hooks/useMembros";
import { usePermission } from "@/hooks/usePermission";
import { PageHeader } from "@/components/ui/page";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { formatDate } from "@/lib/utils";

function Info({ label, value }: { label: string; value?: string | boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">
        {typeof value === "boolean" ? (value ? "Sim" : "Não") : value || "—"}
      </p>
    </div>
  );
}

export default function DetalheMembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const member = useMembro(id);
  const canEdit = usePermission("members.edit");

  if (member.isLoading) return <LoadingState />;
  if (member.isError) return <ErrorState onRetry={() => member.refetch()} />;

  const m = member.data;
  if (!m) return null;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title={m.fullName}
        description={`Membro ${m.status !== "inactive" ? "ativo" : "inativo"}`}
        action={
          <div className="flex gap-2">
            <Link href="/membros">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            {canEdit && (
              <Link href={`/membros/${id}/editar`}>
                <Button>
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="mb-4">
        <Badge color={m.status !== "inactive" ? "green" : "red"}>
          {m.status !== "inactive" ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Dados pessoais</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Info label="Nome completo" value={m.fullName} />
            <Info label="Género" value={m.gender === "Male" ? "Masculino" : m.gender === "Female" ? "Feminino" : m.gender} />
            <Info label="Data de nascimento" value={formatDate(m.birthDate)} />
            <Info label="Telefone" value={m.phoneNumber} />
            <Info label="E-mail" value={m.email} />
            <Info label="Profissão" value={m.profession} />
            <Info label="Nome do pai" value={m.fatherName} />
            <Info label="Nome da mãe" value={m.motherName} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documento</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Info label="BI" value={m.bi} />
            <Info label="Data de emissão" value={formatDate(m.idEmitDate)} />
            <Info label="Cartão de membro" value={m.memberCard} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Residência</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Info label="Província" value={m.residenceProvince} />
            <Info label="Município" value={m.residenceMunicipality} />
            <Info label="Comuna" value={m.residenceCommune} />
            <Info label="Bairro" value={m.residenceNeighbourhood} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Percurso</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <Info label="Habilitações" value={m.level} />
            <Info label="Área de formação" value={m.qualification} />
            <Info label="Ano de admissão" value={m.admissionYear} />
            <Info label="Local de admissão" value={m.admissionPlace} />
            <Info label="Foi militar" value={m.wasMilitar} />
            <Info label="Membro de outro partido" value={m.wasMemberFromAnotherParty} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
