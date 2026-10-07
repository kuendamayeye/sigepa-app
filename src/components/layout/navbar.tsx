"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/card";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  operador: "Operador",
  visualizador: "Visualizador",
};

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          S
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">SIGEPA</p>
          <p className="text-xs text-zinc-500">Sistema de Gestão</p>
        </div>
      </div>

      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
            <UserIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-medium text-zinc-800">{user?.name ?? "..."}</span>
            <span className="block text-xs text-zinc-500">{user?.email}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-zinc-200 bg-white py-1 shadow-lg">
              <div className="border-b border-zinc-100 px-3 py-2">
                <p className="text-sm font-medium text-zinc-800">{user?.name}</p>
                <div className="mt-1">
                  <Badge color="blue">
                    {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Terminar sessão
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
