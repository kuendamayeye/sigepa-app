import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { clearSession, getAccessToken, getRefreshToken, saveTokens } from "@/lib/session";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Anexa o token de acesso em todas as requisições.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Em caso de 401, tenta renovar o token uma única vez.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    // Chamada "crua" para não reentrar nos interceptores.
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1"}/auth/refresh`,
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    if (data?.access_token) {
      saveTokens(data.access_token, data.refresh_token || refreshToken);
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const status = error.response?.status;

    const url = original?.url ?? "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && original && !original._retry && !isAuthRoute) {
      original._retry = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();

      const newToken = await refreshPromise;
      refreshPromise = null;

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }

      // Sessão expirada: limpa tudo e manda para o login.
      clearSession();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        // Reload completo necessário: todos os caches e estados devem ser limpos.
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
