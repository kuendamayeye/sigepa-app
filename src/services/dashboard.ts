import { api } from "@/lib/api";
import type { Stats } from "@/types";

export const dashboardService = {
  async getMemberStats(): Promise<Stats> {
    const { data } = await api.get("/members/statistics/overview");
    return data;
  },

  async getBodyStats(): Promise<Stats> {
    const { data } = await api.get("/bodies/statistics/overview");
    return data;
  },

  async getUserStats(): Promise<Stats> {
    const { data } = await api.get("/users/statistics/overview");
    return data;
  },

  async getStructureStats(): Promise<Stats> {
    const { data } = await api.get("/structures/statistics/overview");
    return data;
  },
};
