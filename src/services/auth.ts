import { api } from "@/lib/api";
import { clearSession, saveRoleCookie, saveTokens } from "@/lib/session";
import type { LoginResponse, User } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
    if (data.access_token) {
      saveTokens(data.access_token, data.refresh_token);
      if (data.user?.role) saveRoleCookie(data.user.role);
    }
    return data;
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/auth/profile");
    if (data?.role) saveRoleCookie(data.role);
    return data;
  },

  async logout() {
    try {
      await api.post("/auth/logout", {});
    } catch {
      // Mesmo com erro no backend, a sessão local é encerrada.
    } finally {
      clearSession();
    }
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const { data } = await api.post("/auth/change-password", { oldPassword, newPassword });
    return data;
  },
};
