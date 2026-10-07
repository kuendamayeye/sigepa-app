export type Role = "admin" | "operador" | "visualizador";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
  provinceId?: string;
  municipalityId?: string;
  createdAt?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user?: User;
}

export interface Member {
  id: string;
  fullName: string;
  gender: "Male" | "Female" | string;
  birthDate?: string;
  fatherName?: string;
  motherName?: string;
  bi?: string;
  idEmitDate?: string;
  phoneNumber?: string;
  email?: string;
  birthLocation?: string;
  birthCommune?: string;
  municipalityCard?: string;
  cardEmitDate?: string;
  residenceProvince?: string;
  residenceMunicipality?: string;
  residenceCommune?: string;
  residenceNeighbourhood?: string;
  residenceProvinceId?: string;
  residenceMunicipalityId?: string;
  residenceCommuneId?: string;
  residenceNeighbourhoodId?: string;
  level?: string;
  gradeOrYear?: string;
  qualification?: string;
  profession?: string;
  admissionYear?: string;
  admissionPlace?: string;
  status?: string;
  isActive?: boolean;
  memberCard?: string;
  memberCardEmitDate?: string;
  wasMilitar?: boolean;
  militarParty?: string;
  wasMemberFromAnotherParty?: boolean;
  previousParty?: string;
  createdAt?: string;
}

export interface BodyType {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface Body {
  id: string;
  name: string;
  description?: string;
  bodyTypeId?: string;
  bodyType?: BodyType;
  memberCount?: number;
  isActive?: boolean;
}

export interface Function_ {
  id: string;
  name: string;
  description?: string;
  bodyTypeId?: string;
  bodyType?: BodyType;
  isActive?: boolean;
}

export interface Structure {
  id: number;
  name: string;
  description?: string;
  memberCount?: number;
  isActive?: boolean;
}

export interface Core {
  id: string;
  name: string;
  description?: string;
  localCommitteeId?: string;
  neighborhoodId?: string;
  memberCount?: number;
  isActive?: boolean;
}

export interface Committee {
  id: string;
  name: string;
  description?: string;
  provinceId?: string;
  municipalityId?: string;
  communeId?: string;
  memberCount?: number;
  isActive?: boolean;
}

export interface Idiom {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface Language {
  id: string;
  name: string;
  description?: string;
  isActive?: boolean;
}

export interface Training {
  id: string;
  name: string;
  description?: string;
  level?: string;
  isActive?: boolean;
}

export interface Province {
  id: string;
  name: string;
  code?: string;
}

export interface Municipality {
  id: string;
  name: string;
  provinceId?: string;
}

export interface Commune {
  id: string;
  name: string;
  municipalityId?: string;
}

export interface Neighborhood {
  id: string;
  name: string;
  communeId?: string;
}

export type Stats = Record<string, number | string | undefined>;
