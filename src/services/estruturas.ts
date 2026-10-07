import { api } from "@/lib/api";
import type { Committee, Core, Stats } from "@/types";

function crud(basePath: string) {
  return {
    async findAll(params?: Record<string, unknown>) {
      const { data } = await api.get(basePath, { params });
      return data;
    },
    async findById(id: string) {
      const { data } = await api.get(`${basePath}/${id}`);
      return data;
    },
    async create(dto: Record<string, unknown>) {
      const { data } = await api.post(basePath, dto);
      return data;
    },
    async update(id: string, dto: Record<string, unknown>) {
      const { data } = await api.patch(`${basePath}/${id}`, dto);
      return data;
    },
    async remove(id: string) {
      const { data } = await api.delete(`${basePath}/${id}`);
      return data;
    },
  };
}

export const estruturasService = {
  ...crud("/structures"),
  async getStatistics(): Promise<Stats> {
    const { data } = await api.get("/structures/statistics/overview");
    return data;
  },
};

export const nucleosService = {
  ...crud("/cores"),
  async getStatistics(): Promise<Stats> {
    const { data } = await api.get("/cores/statistics/overview");
    return data;
  },
  async findOne(id: string): Promise<Core> {
    const { data } = await api.get(`/cores/${id}`);
    return data;
  },
};

export const comitesLocaisService = {
  ...crud("/local-committees"),
  async findOne(id: string): Promise<Committee> {
    const { data } = await api.get(`/local-committees/${id}`);
    return data;
  },
};

export const comitesSectoriaisService = {
  ...crud("/sectorial-committees"),
  async findOne(id: string): Promise<Committee> {
    const { data } = await api.get(`/sectorial-committees/${id}`);
    return data;
  },
};

export const comitesZonaisService = {
  ...crud("/zonal-committees"),
  async findOne(id: string): Promise<Committee> {
    const { data } = await api.get(`/zonal-committees/${id}`);
    return data;
  },
};
