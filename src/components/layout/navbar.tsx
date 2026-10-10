"use client";

import { useState } from "react";
import { ChevronDown, LogOut, User as UserIcon, Users } from "lucide-react";
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
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Users className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold">SIGEPA</span>
      </div>

      <div className="relative">
        <button
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <UserIcon className="h-4 w-4" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block font-medium text-foreground">{user?.name ?? "..."}</span>
            <span className="block text-xs text-muted-foreground">{user?.email}</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-border bg-card py-1 shadow-lg">
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <div className="mt-1">
                  <Badge color="green">
                    {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
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
