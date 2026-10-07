"use client";

import { useQuery } from "@tanstack/react-query";
import { bairrosService, comunasService, municipiosService, provinciasService } from "@/services/geografia";
import { toList } from "@/lib/utils";
import type { Commune, Municipality, Neighborhood, Province } from "@/types";

export function useProvincias() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => provinciasService.findAll(),
    select: (res) => toList<Province>(res),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMunicipios(provinceId?: string) {
  return useQuery({
    queryKey: ["municipalities", provinceId ?? "all"],
    queryFn: () => municipiosService.findAll(provinceId ? { provinceId } : undefined),
    select: (res) => toList<Municipality>(res),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useComunas(municipalityId?: string) {
  return useQuery({
    queryKey: ["communes", municipalityId ?? "all"],
    queryFn: () => comunasService.findAll(municipalityId ? { municipalityId } : undefined),
    select: (res) => toList<Commune>(res),
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBairros(communeId?: string) {
  return useQuery({
    queryKey: ["neighborhoods", communeId ?? "all"],
    queryFn: () => bairrosService.findAll(communeId ? { communeId } : undefined),
    select: (res) => toList<Neighborhood>(res),
    enabled: !!communeId,
    staleTime: 5 * 60 * 1000,
  });
}
