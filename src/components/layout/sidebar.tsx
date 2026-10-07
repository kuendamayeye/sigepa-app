"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import type { Permission } from "@/lib/permissions";

interface MenuItem {
  href: string;
  label: string;
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
    items: [{ href: "/dashboard", label: "Dashboard", permission: "dashboard.view" }],
  },
  {
    label: "Membros",
    permission: "members.view",
    items: [
      { href: "/membros", label: "Listagem" },
      { href: "/membros/novo", label: "Novo membro", permission: "members.create" },
    ],
  },
  {
    label: "Órgãos",
    permission: "bodies.view",
    items: [
      { href: "/orgaos", label: "Órgãos" },
      { href: "/orgaos/tipos", label: "Tipos de órgão" },
      { href: "/orgaos/funcoes", label: "Funções" },
    ],
  },
  {
    label: "Estruturas",
    permission: "structures.view",
    items: [
      { href: "/estruturas", label: "Visão geral" },
      { href: "/estruturas/nucleo", label: "Núcleos" },
      { href: "/estruturas/comites-locais", label: "Comitês locais" },
      { href: "/estruturas/comites-sectoriais", label: "Comitês sectoriais" },
      { href: "/estruturas/comites-zonais", label: "Comitês zonais" },
    ],
  },
  {
    label: "Administrativo",
    permission: "admin.view",
    items: [
      { href: "/administrativo", label: "Visão geral" },
      { href: "/administrativo/usuarios", label: "Usuários", permission: "users.manage" },
      { href: "/administrativo/idiomas", label: "Idiomas" },
      { href: "/administrativo/linguas", label: "Línguas" },
      { href: "/administrativo/formacoes", label: "Formações" },
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
        className="fixed bottom-4 right-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg md:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto border-r border-zinc-200 bg-white pt-16 md:pt-0",
          "transition-transform md:static md:translate-x-0 md:pt-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="space-y-4 p-4">
          {MENU.filter((group) => !group.permission || hasPermission(group.permission)).map(
            (group) => (
              <div key={group.label}>
                <p className="mb-1 px-2 text-xs font-semibold uppercase text-zinc-400">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
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
                                ? "bg-blue-50 font-medium text-blue-700"
                                : "text-zinc-600 hover:bg-zinc-100"
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
