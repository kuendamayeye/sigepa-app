import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-PT");
}

/** Aceita resposta como array direto ou como { data: [...] }. */
export function toList<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];
  if (response && typeof response === "object" && Array.isArray((response as { data?: unknown }).data)) {
    return (response as { data: T[] }).data;
  }
  return [];
}

/** Extrai uma mensagem legível de um erro da API. */
export function getApiErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { message?: string | string[]; error?: string } };
      message?: string;
    };
    const data = err.response?.data;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err.message) return err.message;
  }
  return "Ocorreu um erro inesperado.";
}

/** "lastAccessAt" -> "Last Access At" */
export function prettifyKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
