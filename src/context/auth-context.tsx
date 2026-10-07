"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth";
import { getAccessToken } from "@/lib/session";
import { can, type Permission } from "@/lib/permissions";
import type { Role, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  role: Role | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o perfil se já existir uma sessão salva.
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      // Primeiro await: garante que os estados só mudam de forma assíncrona.
      await Promise.resolve();
      if (!getAccessToken()) {
        if (active) setIsLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        if (active) setUser(profile);
      } catch {
        // Sessão inválida: mantém deslogado.
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await authService.login(email, password);
      if (response.user) {
        setUser(response.user);
      } else {
        const profile = await authService.getProfile();
        setUser(profile);
      }
      setIsLoading(false);
    },
    []
  );

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/login";
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      hasPermission: (permission: Permission) => can(user?.role, permission),
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }
  return context;
}
