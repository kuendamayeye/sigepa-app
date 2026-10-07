"use client";

import { Building2, Network, UserCog, Users } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useAuth } from "@/context/auth-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PageHeader } from "@/components/ui/page";

export default function DashboardPage() {
  const { user } = useAuth();
  const stats = useDashboardStats();

  return (
    <div>
      <PageHeader
        title={`Bem-vindo, ${user?.name?.split(" ")[0] ?? "usuário"}`}
        description="Visão geral do sistema"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Membros" icon={Users} query={stats.members} />
        <StatsCard title="Órgãos" icon={Building2} query={stats.bodies} />
        <StatsCard title="Estruturas" icon={Network} query={stats.structures} />
        <StatsCard title="Usuários" icon={UserCog} query={stats.users} />
      </div>
    </div>
  );
}
