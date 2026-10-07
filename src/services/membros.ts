import { api } from "@/lib/api";
import type { Member, Stats } from "@/types";

export interface MemberFilters {
  search?: string;
  provinceId?: string;
  municipalityId?: string;
  communeId?: string;
  isActive?: boolean;
  includeProvince?: boolean;
  includeMunicipality?: boolean;
  includeCommune?: boolean;
  includeStructure?: boolean;
}

export const membrosService = {
  async findAll(params?: MemberFilters) {
    const { data } = await api.get("/members", { params });
    return data;
  },

  async findById(id: string) {
    const { data } = await api.get<Member>(`/members/${id}`);
    return data;
  },

  async create(dto: Partial<Member>) {
    const { data } = await api.post("/members", dto);
    return data;
  },

  async update(id: string, dto: Partial<Member>) {
    const { data } = await api.patch<Member>(`/members/${id}`, dto);
    return data;
  },

  async remove(id: string) {
    const { data } = await api.delete(`/members/${id}`);
    return data;
  },

  async activate(id: string) {
    const { data } = await api.post(`/members/${id}/activate`);
    return data;
  },

  async deactivate(id: string) {
    const { data } = await api.post(`/members/${id}/deactivate`);
    return data;
  },

  async getStatistics(): Promise<Stats> {
    const { data } = await api.get("/members/statistics/overview");
    return data;
  },
};
