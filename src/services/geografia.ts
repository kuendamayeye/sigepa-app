import { api } from "@/lib/api";
import type { Commune, Municipality, Neighborhood, Province } from "@/types";

export const provinciasService = {
  async findAll() {
    const { data } = await api.get("/provinces");
    return data;
  },
  async findById(id: string) {
    const { data } = await api.get<Province>(`/provinces/${id}`);
    return data;
  },
};

export const municipiosService = {
  async findAll(params?: { provinceId?: string }) {
    const { data } = await api.get("/municipalities", { params });
    return data;
  },
  async findById(id: string) {
    const { data } = await api.get<Municipality>(`/municipalities/${id}`);
    return data;
  },
};

export const comunasService = {
  async findAll(params?: { municipalityId?: string }) {
    const { data } = await api.get("/communes", { params });
    return data;
  },
  async findById(id: string) {
    const { data } = await api.get<Commune>(`/communes/${id}`);
    return data;
  },
};

export const bairrosService = {
  async findAll(params?: { communeId?: string }) {
    const { data } = await api.get("/neighborhoods", { params });
    return data;
  },
  async findById(id: string) {
    const { data } = await api.get<Neighborhood>(`/neighborhoods/${id}`);
    return data;
  },
};
