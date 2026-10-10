"use client";

import Link from "next/link";
import { GraduationCap, Languages, MessageSquare, Users } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { PageHeader } from "@/components/ui/page";
import { Card } from "@/components/ui/card";

const SECTIONS = [
  {
    href: "/administrativo/usuarios",
    title: "Usuários",
    description: "Contas de acesso e permissões",
    icon: Users,
    requiresUsers: true,
  },
  {
    href: "/administrativo/idiomas",
    title: "Idiomas",
    description: "Registo de idiomas dos membros",
    icon: MessageSquare,
    requiresUsers: false,
  },
  {
    href: "/administrativo/linguas",
    title: "Línguas",
    description: "Línguas oficiais e regionais",
    icon: Languages,
    requiresUsers: false,
  },
  {
    href: "/administrativo/formacoes",
    title: "Formações",
    description: "Cursos e formações dos membros",
    icon: GraduationCap,
    requiresUsers: false,
  },
];

export default function AdministrativoPage() {
  const canViewAdmin = usePermission("admin.view");
  const canManageUsers = usePermission("users.manage");

  const sections = SECTIONS.filter((s) =>
    s.requiresUsers ? canManageUsers : canViewAdmin
  );

  return (
    <div>
      <PageHeader title="Área administrativa" description="Configurações e dados de apoio" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="h-full p-5 transition-shadow hover:shadow-md">
              <section.icon className="mb-3 h-6 w-6 text-primary" />
              <p className="font-semibold text-foreground">{section.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
