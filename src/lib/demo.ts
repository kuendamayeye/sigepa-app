import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

/**
 * Modo demonstração: permite navegar no frontend sem backend.
 * Ativado por NEXT_PUBLIC_DEMO_MODE=true (ver .env.local).
 *
 * As respostas são servidas por um adaptador axios em memória, com dados de
 * exemplo e CRUD funcional (criar/editar/remover refletem-se na lista).
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

type DemoItem = Record<string, unknown> & { id: string | number };

const DEMO_USER_KEY = "sigepa_demo_user";

function defaultUser() {
  return {
    id: "user-demo",
    name: "Administrador Demo",
    email: "admin@sigepa.ao",
    role: "admin",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

function readStoredUser() {
  if (typeof window === "undefined") return defaultUser();
  try {
    const raw = localStorage.getItem(DEMO_USER_KEY);
    return raw ? JSON.parse(raw) : defaultUser();
  } catch {
    return defaultUser();
  }
}

function writeStoredUser(user: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify(user));
}

const now = () => new Date().toISOString();

function item(id: string | number, name: string, extra: Record<string, unknown> = {}): DemoItem {
  return { id, name, description: "", isActive: true, createdAt: now(), ...extra };
}

function seed(): Record<string, DemoItem[]> {
  const provinces = [
    item("prov-luanda", "Luanda", { code: "LD" }),
    item("prov-benguela", "Benguela", { code: "BG" }),
    item("prov-huila", "Huíla", { code: "HL" }),
    item("prov-huambo", "Huambo", { code: "HB" }),
    item("prov-cabinda", "Cabinda", { code: "CB" }),
  ];

  const municipalities = [
    item("mun-belas", "Belas", { provinceId: "prov-luanda" }),
    item("mun-cacuaco", "Cacuaco", { provinceId: "prov-luanda" }),
    item("mun-lobito", "Lobito", { provinceId: "prov-benguela" }),
    item("mun-catumbela", "Catumbela", { provinceId: "prov-benguela" }),
    item("mun-lubango", "Lubango", { provinceId: "prov-huila" }),
    item("mun-huambo", "Huambo", { provinceId: "prov-huambo" }),
    item("mun-cabinda", "Cabinda", { provinceId: "prov-cabinda" }),
  ];

  const communes = [
    item("com-camama", "Camama", { municipalityId: "mun-belas" }),
    item("com-kikuxi", "Kikuxi", { municipalityId: "mun-cacuaco" }),
    item("com-restinga", "Restinga", { municipalityId: "mun-lobito" }),
    item("com-praia", "Praia do Bispo", { municipalityId: "mun-lobito" }),
  ];

  const neighborhoods = [
    item("bai-camama-1", "Camama I", { communeId: "com-camama" }),
    item("bai-camama-2", "Camama II", { communeId: "com-camama" }),
    item("bai-kikuxi-1", "Kikuxi I", { communeId: "com-kikuxi" }),
  ];

  const bodyTypes = [
    item("bt-nacional", "Órgão Nacional"),
    item("bt-provincial", "Órgão Provincial"),
    item("bt-municipal", "Órgão Municipal"),
  ];

  const bodies = [
    item("body-cc", "Comité Central", { bodyTypeId: "bt-nacional", memberCount: 45 }),
    item("body-cp-ld", "Comité Provincial de Luanda", { bodyTypeId: "bt-provincial", memberCount: 32 }),
    item("body-cm-belas", "Comité Municipal de Belas", { bodyTypeId: "bt-municipal", memberCount: 18 }),
  ];

  const functions = [
    item("fn-presidente", "Presidente", { bodyTypeId: "bt-nacional" }),
    item("fn-sec-geral", "Secretário-Geral", { bodyTypeId: "bt-nacional" }),
    item("fn-tesoureiro", "Tesoureiro", { bodyTypeId: "bt-provincial" }),
    item("fn-secretario", "Secretário", { bodyTypeId: "bt-municipal" }),
  ];

  const structures = [
    { id: 1, name: "Assembleia Central", description: "Estrutura máxima de decisão", memberCount: 120, isActive: true },
    { id: 2, name: "Comité Provincial", description: "Coordenação provincial", memberCount: 45, isActive: true },
    { id: 3, name: "Comité Municipal", description: "Coordenação municipal", memberCount: 30, isActive: true },
  ];

  const cores = [
    item("core-1", "Núcleo 1 — Belas", { localCommitteeId: "lc-belas", neighborhoodId: "bai-camama-1", memberCount: 12 }),
    item("core-2", "Núcleo 2 — Cacuaco", { localCommitteeId: "lc-cacuaco", neighborhoodId: "bai-kikuxi-1", memberCount: 9 }),
    item("core-3", "Núcleo 3 — Lobito", { localCommitteeId: "lc-lobito", neighborhoodId: "bai-camama-2", memberCount: 15 }),
  ];

  const committees = (prefix: string, label: string) => [
    item(`${prefix}-1`, `${label} 1`, { provinceId: "prov-luanda", municipalityId: "mun-belas", memberCount: 20 }),
    item(`${prefix}-2`, `${label} 2`, { provinceId: "prov-benguela", municipalityId: "mun-lobito", memberCount: 14 }),
    item(`${prefix}-3`, `${label} 3`, { provinceId: "prov-huila", municipalityId: "mun-lubango", memberCount: 8 }),
  ];

  const members: DemoItem[] = [
    ["Ana Manuel Domingos", "Female", "prov-luanda", "mun-belas", "com-camama", "bai-camama-1"],
    ["Bruno Kiala Ferreira", "Male", "prov-luanda", "mun-cacuaco", "com-kikuxi", "bai-kikuxi-1"],
    ["Carla Nzinga Baptista", "Female", "prov-benguela", "mun-lobito", "com-restinga", "bai-camama-2"],
    ["David Muanza Silva", "Male", "prov-luanda", "mun-belas", "com-camama", "bai-camama-2"],
    ["Esperança Cassule Neto", "Female", "prov-huila", "mun-lubango", "", ""],
    ["Fábio Tchipa Gomes", "Male", "prov-huambo", "mun-huambo", "", ""],
    ["Gabriela Mbala Costa", "Female", "prov-cabinda", "mun-cabinda", "", ""],
    ["Hélio Vunge Machado", "Male", "prov-luanda", "mun-cacuaco", "com-kikuxi", "bai-kikuxi-1"],
    ["Inês Kapangala Dias", "Female", "prov-benguela", "mun-catumbela", "", ""],
    ["João Kalunga Matos", "Male", "prov-luanda", "mun-belas", "com-camama", "bai-camama-1"],
    ["Kátia Ndombele Rocha", "Female", "prov-huila", "mun-lubango", "", ""],
    ["Luís Semba Andrade", "Male", "prov-huambo", "mun-huambo", "", ""],
  ].map((row, i) => {
    const [fullName, gender, residenceProvinceId, residenceMunicipalityId, residenceCommuneId, residenceNeighbourhoodId] = row;
    return {
      id: `member-${i + 1}`,
      fullName,
      gender,
      birthDate: `19${70 + (i % 25)}-0${(i % 9) + 1}-1${i % 9}`,
      fatherName: `Pai de ${String(fullName).split(" ")[0]}`,
      motherName: `Mãe de ${String(fullName).split(" ")[0]}`,
      bi: `00${100000 + i}LA0${i}`,
      phoneNumber: `9${23 + (i % 6)}${100000 + i * 137}`,
      email: `${String(fullName).split(" ")[0].toLowerCase()}.${i}@exemplo.ao`,
      residenceProvinceId,
      residenceMunicipalityId,
      residenceCommuneId,
      residenceNeighbourhoodId,
      residenceProvince: String(provinces.find((p) => p.id === residenceProvinceId)?.name ?? ""),
      residenceMunicipality: String(municipalities.find((m) => m.id === residenceMunicipalityId)?.name ?? ""),
      level: ["Primário", "Secundário", "Médio", "Superior"][i % 4],
      profession: ["Professor(a)", "Enfermeiro(a)", "Engenheiro(a)", "Comerciante", "Estudante"][i % 5],
      admissionYear: String(1995 + (i % 25)),
      status: i % 5 === 0 ? "inactive" : "active",
      isActive: i % 5 !== 0,
      createdAt: now(),
    };
  });

  const users = [
    { id: "user-admin", name: "Administrador Demo", email: "admin@sigepa.ao", role: "admin", isActive: true, createdAt: now() },
    { id: "user-operador", name: "Operador Demo", email: "operador@sigepa.ao", role: "operador", isActive: true, createdAt: now() },
    { id: "user-visual", name: "Visualizador Demo", email: "visualizador@sigepa.ao", role: "visualizador", isActive: true, createdAt: now() },
    { id: "user-4", name: "Marta Quissanga", email: "marta@sigepa.ao", role: "operador", isActive: false, createdAt: now() },
  ];

  const idioms = [
    item("idiom-1", "Kimbundu"),
    item("idiom-2", "Umbundu"),
    item("idiom-3", "Kikongo"),
    item("idiom-4", "Nganguela"),
  ];

  const languages = [
    item("lang-1", "Português"),
    item("lang-2", "Inglês"),
    item("lang-3", "Francês"),
  ];

  const trainings = [
    item("training-1", "Formação Básica de Quadros", { level: "Básico" }),
    item("training-2", "Formação Intermédia de Gestão", { level: "Intermédio" }),
    item("training-3", "Formação Avançada de Liderança", { level: "Avançado" }),
  ];

  return {
    provinces,
    municipalities,
    communes,
    neighborhoods,
    members,
    "body-types": bodyTypes,
    bodies,
    functions,
    structures,
    cores,
    "local-committees": [
      item("lc-belas", "Comité Local de Belas", { provinceId: "prov-luanda", municipalityId: "mun-belas", memberCount: 20 }),
      item("lc-cacuaco", "Comité Local de Cacuaco", { provinceId: "prov-luanda", municipalityId: "mun-cacuaco", memberCount: 14 }),
      item("lc-lobito", "Comité Local do Lobito", { provinceId: "prov-benguela", municipalityId: "mun-lobito", memberCount: 9 }),
    ],
    "sectorial-committees": committees("sc", "Comité Sectorial"),
    "zonal-committees": committees("zc", "Comité Zonal"),
    users,
    idioms,
    languages,
    trainings,
  };
}

const db = seed();

const NUMERIC_IDS = new Set(["structures"]);

function nextId(resource: string): string | number {
  const list = db[resource] ?? [];
  if (NUMERIC_IDS.has(resource)) {
    return list.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;
  }
  return `demo-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`;
}

function stats(resource: string): Record<string, number> {
  const list = db[resource] ?? [];
  const total = list.length;
  const active = list.filter((r) => r.isActive !== false).length;
  const base = { total, active, inactive: total - active };

  switch (resource) {
    case "members":
      return {
        ...base,
        male: list.filter((r) => r.gender === "Male").length,
        female: list.filter((r) => r.gender === "Female").length,
      };
    case "users":
      return { ...base, admins: list.filter((r) => r.role === "admin").length };
    case "structures":
      return {
        total,
        active,
        cores: (db.cores ?? []).length,
        localCommittees: (db["local-committees"] ?? []).length,
        sectorialCommittees: (db["sectorial-committees"] ?? []).length,
        zonalCommittees: (db["zonal-committees"] ?? []).length,
      };
    default:
      return base;
  }
}

function applyFilters(
  resource: string,
  list: DemoItem[],
  params: Record<string, unknown>
): DemoItem[] {
  let out = list;

  if (resource === "members") {
    const search = String(params.search ?? "").trim().toLowerCase();
    if (search) {
      out = out.filter((m) =>
        [m.fullName, m.bi, m.email, m.phoneNumber].some((v) =>
          String(v ?? "").toLowerCase().includes(search)
        )
      );
    }
    if (params.provinceId) {
      out = out.filter((m) => String(m.residenceProvinceId) === String(params.provinceId));
    }
    if (params.municipalityId) {
      out = out.filter((m) => String(m.residenceMunicipalityId) === String(params.municipalityId));
    }
  }

  if (resource === "municipalities" && params.provinceId) {
    out = out.filter((m) => String(m.provinceId) === String(params.provinceId));
  }
  if (resource === "communes" && params.municipalityId) {
    out = out.filter((m) => String(m.municipalityId) === String(params.municipalityId));
  }
  if (resource === "neighborhoods" && params.communeId) {
    out = out.filter((m) => String(m.communeId) === String(params.communeId));
  }
  if ((resource === "bodies" || resource === "functions") && params.bodyTypeId) {
    out = out.filter((m) => String(m.bodyTypeId) === String(params.bodyTypeId));
  }
  if (params.isActive === true) {
    out = out.filter((m) => m.isActive !== false);
  }

  return out;
}

function reply<T>(
  config: InternalAxiosRequestConfig,
  data: T,
  status = 200
): AxiosResponse<T> {
  return { data, status, statusText: "OK", headers: {}, config };
}

function fail(
  config: InternalAxiosRequestConfig,
  status: number,
  message: string
): Promise<never> {
  const response = reply(config, { message }, status);
  return Promise.reject(new AxiosError(message, String(status), config, undefined, response));
}

function parseBody(config: InternalAxiosRequestConfig): Record<string, unknown> {
  const data = config.data;
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data as Record<string, unknown>;
}

function normalizePath(config: InternalAxiosRequestConfig): string[] {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api/v1";
  const raw = (config.url ?? "").replace(base, "").split("?")[0];
  return raw.split("/").filter(Boolean);
}

function handleAuth(
  segments: string[],
  method: string,
  config: InternalAxiosRequestConfig,
  body: Record<string, unknown>
): Promise<AxiosResponse> | AxiosResponse {
  const action = segments[1];

  if (action === "login" && method === "post") {
    const email = String(body.email ?? "admin@sigepa.ao");
    const hint = email.toLowerCase();
    const role = hint.includes("visual")
      ? "visualizador"
      : hint.includes("oper")
        ? "operador"
        : "admin";
    const name = email.split("@")[0].replace(/[._-]+/g, " ") || "Utilizador Demo";
    const user = {
      id: "user-demo",
      name: name.replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role,
      isActive: true,
    };
    writeStoredUser(user);
    return reply(config, {
      access_token: "demo-access-token",
      refresh_token: "demo-refresh-token",
      user,
    });
  }

  if (action === "refresh") {
    return reply(config, {
      access_token: "demo-access-token",
      refresh_token: "demo-refresh-token",
    });
  }

  if (action === "profile") {
    return reply(config, readStoredUser());
  }

  if (action === "logout" || action === "change-password") {
    return reply(config, {});
  }

  return fail(config, 404, `Rota de autenticação desconhecida: ${segments.join("/")}`);
}

function handleCollection(
  segments: string[],
  method: string,
  config: InternalAxiosRequestConfig,
  body: Record<string, unknown>,
  params: Record<string, unknown>
): Promise<AxiosResponse> | AxiosResponse {
  const resource = segments[0];
  const list = db[resource];

  if (!list) {
    return fail(config, 404, `Recurso de demonstração desconhecido: ${resource}`);
  }

  const id = segments[1];

  if (!id) {
    if (method === "get") {
      return reply(config, applyFilters(resource, list, params));
    }
    if (method === "post") {
      const created: DemoItem = { id: nextId(resource), isActive: true, createdAt: now(), ...body };
      list.unshift(created);
      return reply(config, created, 201);
    }
    return fail(config, 405, `Método ${method} não suportado em ${resource}`);
  }

  const index = list.findIndex((r) => String(r.id) === String(id));
  if (index === -1) {
    return fail(config, 404, `${resource}/${id} não encontrado`);
  }

  const action = segments[2];

  if (action === "activate" || action === "deactivate") {
    list[index] = { ...list[index], isActive: action === "activate" };
    return reply(config, list[index]);
  }

  if (method === "get") {
    return reply(config, list[index]);
  }
  if (method === "patch" || method === "put") {
    list[index] = { ...list[index], ...body, id: list[index].id };
    return reply(config, list[index]);
  }
  if (method === "delete") {
    list.splice(index, 1);
    return reply(config, {});
  }

  return fail(config, 405, `Método ${method} não suportado em ${resource}/${id}`);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Adaptador axios que serve o modo demonstração (sem backend). */
export const demoAdapter: AxiosAdapter = async (config) => {
  await wait(180);

  const method = (config.method ?? "get").toLowerCase();
  const segments = normalizePath(config);
  const body = parseBody(config);
  const params = (config.params ?? {}) as Record<string, unknown>;

  if (segments.length === 0) {
    return reply(config, { message: "SIGEPA — modo demonstração" });
  }

  if (segments[0] === "auth") {
    return handleAuth(segments, method, config, body);
  }

  if (segments[1] === "statistics") {
    if (!db[segments[0]]) {
      return fail(config, 404, `Estatísticas desconhecidas: ${segments[0]}`);
    }
    return reply(config, stats(segments[0]));
  }

  return handleCollection(segments, method, config, body, params);
};
