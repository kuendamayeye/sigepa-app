"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard";

export function useDashboardStats() {
  const members = useQuery({
    queryKey: ["dashboard-members"],
    queryFn: () => dashboardService.getMemberStats(),
  });

  const bodies = useQuery({
    queryKey: ["dashboard-bodies"],
    queryFn: () => dashboardService.getBodyStats(),
  });

  const users = useQuery({
    queryKey: ["dashboard-users"],
    queryFn: () => dashboardService.getUserStats(),
  });

  const structures = useQuery({
    queryKey: ["dashboard-structures"],
    queryFn: () => dashboardService.getStructureStats(),
  });

  return { members, bodies, users, structures };
}
