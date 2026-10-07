import { api } from "@/lib/api";
import type { Body, BodyType, Function_, Stats } from "@/types";

export const orgaosService = {
  async findAll(params?: { bodyTypeId?: string; isActive?: boolean }) {
    const { data } = await api.get("/bodies", { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get<Body>(`/bodies/${id}`);
    return data;
  },

  async create(dto: { name: string; description?: string; bodyTypeId: string }) {
    const { data } = await api.post("/bodies", dto);
    return data;
  },

  async update(id: string, dto: Partial<Body>) {
    const { data } = await api.patch<Body>(`/bodies/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/bodies/${id}`);
    return data;
  },

  async getStatistics(): Promise<Stats> {
    const { data } = await api.get("/bodies/statistics/overview");
    return data;
  },
};

export const tiposOrgaoService = {
  async findAll(params?: { isActive?: boolean }) {
    const { data } = await api.get("/body-types", { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get<BodyType>(`/body-types/${id}`);
    return data;
  },

  async create(dto: { name: string; description?: string }) {
    const { data } = await api.post("/body-types", dto);
    return data;
  },

  async update(id: string, dto: Partial<BodyType>) {
    const { data } = await api.patch<BodyType>(`/body-types/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/body-types/${id}`);
    return data;
  },
};

export const funcoesService = {
  async findAll(params?: { bodyTypeId?: string; isActive?: boolean }) {
    const { data } = await api.get("/functions", { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get<Function_>(`/functions/${id}`);
    return data;
  },

  async create(dto: { name: string; description?: string; bodyTypeId?: string }) {
    const { data } = await api.post("/functions", dto);
    return data;
  },

  async update(id: string, dto: Partial<Function_>) {
    const { data } = await api.patch<Function_>(`/functions/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/functions/${id}`);
    return data;
  },
};
