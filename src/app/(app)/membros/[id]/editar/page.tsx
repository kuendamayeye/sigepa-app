"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useMembro, useMembros } from "@/hooks/useMembros";
import { MemberForm, type MemberFormData } from "@/components/membros/member-form";
import { PageHeader } from "@/components/ui/page";
import { ErrorState, LoadingState } from "@/components/ui/states";

export default function EditarMembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const member = useMembro(id);
  const { update } = useMembros();

  async function onSubmit(data: MemberFormData) {
    await update.mutateAsync({ id, data });
    router.push(`/membros/${id}`);
  }

  if (member.isLoading) return <LoadingState />;
  if (member.isError) return <ErrorState onRetry={() => member.refetch()} />;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Editar membro" description={member.data?.fullName} />
      <MemberForm
        initialData={member.data}
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        isSubmitting={update.isPending}
      />
    </div>
  );
}
