import { api } from "@/lib/api";
import type { Stats, User } from "@/types";

export const usuariosService = {
  async findAll(params?: { scopeLevel?: string; provinceId?: string; status?: string }) {
    const { data } = await api.get("/users", { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  async create(dto: { name: string; email: string; password: string; role: string }) {
    const { data } = await api.post("/users", dto);
    return data;
  },

  async update(id: string, dto: Partial<User>) {
    const { data } = await api.patch<User>(`/users/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  async activate(id: string) {
    const { data } = await api.post(`/users/${id}/activate`);
    return data;
  },

  async deactivate(id: string) {
    const { data } = await api.post(`/users/${id}/deactivate`);
    return data;
  },

  async getStatistics(): Promise<Stats> {
    const { data } = await api.get("/users/statistics/overview");
    return data;
  },
};

/** Catálogo simples com o mesmo formato CRUD (idiomas, línguas, formações). */
export function createCatalogService(basePath: string) {
  return {
    async findAll(params?: Record<string, unknown>) {
      const { data } = await api.get(basePath, { params });
      return data;
    },
    async findById(id: string) {
      const { data } = await api.get(`${basePath}/${id}`);
      return data;
    },
    async create(dto: { name: string; description?: string }) {
      const { data } = await api.post(basePath, dto);
      return data;
    },
    async update(id: string, dto: { name?: string; description?: string }) {
      const { data } = await api.patch(`${basePath}/${id}`, dto);
      return data;
    },
    async remove(id: string) {
      const { data } = await api.delete(`${basePath}/${id}`);
      return data;
    },
    async getStatistics(): Promise<Stats> {
      const { data } = await api.get(`${basePath}/statistics/overview`);
      return data;
    },
  };
}

export type CatalogService = ReturnType<typeof createCatalogService>;

export const idiomasService = createCatalogService("/idioms");
export const linguasService = createCatalogService("/languages");
export const formacoesService = createCatalogService("/trainings");
