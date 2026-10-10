"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Boxes,
  Briefcase,
  GraduationCap,
  Languages,
  LayoutDashboard,
  Layers,
  ListChecks,
  Menu,
  MessageSquare,
  ScrollText,
  Settings,
  Tags,
  UserCog,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Permission } from "@/lib/permissions";

interface MenuItem {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: Permission;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
  permission?: Permission;
}

const MENU: MenuGroup[] = [
  {
    label: "Geral",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Membros",
    permission: "members.view",
    items: [
      { href: "/membros", label: "Listagem", icon: Users },
      {
        href: "/membros/novo",
        label: "Novo membro",
        icon: UserPlus,
        permission: "members.create",
      },
    ],
  },
  {
    label: "Órgãos",
    permission: "bodies.view",
    items: [
      { href: "/orgaos", label: "Órgãos", icon: ScrollText },
      { href: "/orgaos/tipos", label: "Tipos de órgão", icon: Tags },
      { href: "/orgaos/funcoes", label: "Funções", icon: Briefcase },
    ],
  },
  {
    label: "Estruturas",
    permission: "structures.view",
    items: [
      { href: "/estruturas", label: "Visão geral", icon: Layers },
      { href: "/estruturas/nucleo", label: "Núcleos", icon: Boxes },
      {
        href: "/estruturas/comites-locais",
        label: "Comitês locais",
        icon: ListChecks,
      },
      {
        href: "/estruturas/comites-sectoriais",
        label: "Comitês sectoriais",
        icon: ListChecks,
      },
      {
        href: "/estruturas/comites-zonais",
        label: "Comitês zonais",
        icon: ListChecks,
      },
    ],
  },
  {
    label: "Administrativo",
    permission: "admin.view",
    items: [
      { href: "/administrativo", label: "Visão geral", icon: Settings },
      {
        href: "/administrativo/usuarios",
        label: "Usuários",
        icon: UserCog,
        permission: "users.manage",
      },
      { href: "/administrativo/idiomas", label: "Idiomas", icon: Languages },
      { href: "/administrativo/linguas", label: "Línguas", icon: MessageSquare },
      { href: "/administrativo/formacoes", label: "Formações", icon: GraduationCap },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botão mobile */}
      <button
        className="fixed bottom-4 right-4 z-40 rounded-full bg-primary text-primary-foreground p-3 text-white shadow-lg md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto border-r bg-card pt-16 md:pt-0",
          "transition-transform md:static md:translate-x-0 md:pt-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="px-3 pb-6 pt-4">
          {MENU.filter((group) => !group.permission || hasPermission(group.permission)).map(
            (group) => (
              <div key={group.label}>
                <p className="px-3 pb-2 pt-3 text-xs font-semibold uppercase text-muted-foreground">
                  {group.label}
                </p>
                <ul className="space-y-1">
                  {group.items
                    .filter((item) => !item.permission || hasPermission(item.permission))
                    .map((item) => {
                      const active =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "block rounded-md px-2 py-1.5 text-sm transition-colors",
                              active
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )
          )}
        </nav>
      </aside>
    </>
  );
}
