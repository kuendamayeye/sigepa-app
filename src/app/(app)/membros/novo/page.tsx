"use client";

import { useRouter } from "next/navigation";
import { useMembros } from "@/hooks/useMembros";
import { MemberForm, type MemberFormData } from "@/components/membros/member-form";
import { PageHeader } from "@/components/ui/page";

export default function NovoMembroPage() {
  const router = useRouter();
  const { create } = useMembros();

  async function onSubmit(data: MemberFormData) {
    await create.mutateAsync(data);
    router.push("/membros");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Novo membro" description="Registar um novo membro" />
      <MemberForm
        onSubmit={onSubmit}
        onCancel={() => router.back()}
        isSubmitting={create.isPending}
      />
    </div>
  );
}
