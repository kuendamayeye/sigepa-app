"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBairros, useComunas, useMunicipios, useProvincias } from "@/hooks/useGeografia";
import type { Member } from "@/types";

export const memberSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo"),
  gender: z.string().min(1, "Selecione o género"),
  birthDate: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  bi: z.string().optional(),
  idEmitDate: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().trim().email("E-mail inválido").or(z.literal("")),
  residenceProvinceId: z.string().min(1, "Selecione a província"),
  residenceMunicipalityId: z.string().min(1, "Selecione o município"),
  residenceCommuneId: z.string().optional(),
  residenceNeighbourhoodId: z.string().optional(),
  profession: z.string().optional(),
  qualification: z.string().optional(),
  level: z.string().optional(),
  admissionYear: z.string().optional(),
  admissionPlace: z.string().optional(),
  status: z.string().optional(),
  wasMilitar: z.boolean().optional(),
  wasMemberFromAnotherParty: z.boolean().optional(),
});

export type MemberFormData = z.infer<typeof memberSchema>;

export function MemberForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  initialData?: Member;
  onSubmit: (data: MemberFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: "active",
      ...toFormData(initialData),
    },
  });

  const provinceId = watch("residenceProvinceId");
  const municipalityId = watch("residenceMunicipalityId");
  const communeId = watch("residenceCommuneId");

  const provincias = useProvincias();
  const municipios = useMunicipios(provinceId);
  const comunas = useComunas(municipalityId);
  const bairros = useBairros(communeId);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo" htmlFor="fullName" error={errors.fullName?.message} required>
            <Input id="fullName" {...register("fullName")} />
          </Field>
          <Field label="Género" htmlFor="gender" error={errors.gender?.message} required>
            <Select id="gender" {...register("gender")}>
              <option value="">Selecione...</option>
              <option value="Male">Masculino</option>
              <option value="Female">Feminino</option>
            </Select>
          </Field>
          <Field label="Data de nascimento" htmlFor="birthDate" error={errors.birthDate?.message}>
            <Input id="birthDate" type="date" {...register("birthDate")} />
          </Field>
          <Field label="Telefone" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
            <Input id="phoneNumber" {...register("phoneNumber")} />
          </Field>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </Field>
          <Field label="Profissão" htmlFor="profession" error={errors.profession?.message}>
            <Input id="profession" {...register("profession")} />
          </Field>
          <Field label="Nome do pai" htmlFor="fatherName" error={errors.fatherName?.message}>
            <Input id="fatherName" {...register("fatherName")} />
          </Field>
          <Field label="Nome da mãe" htmlFor="motherName" error={errors.motherName?.message}>
            <Input id="motherName" {...register("motherName")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documento de identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="BI / Identificação" htmlFor="bi" error={errors.bi?.message}>
            <Input id="bi" {...register("bi")} />
          </Field>
          <Field label="Data de emissão" htmlFor="idEmitDate" error={errors.idEmitDate?.message}>
            <Input id="idEmitDate" type="date" {...register("idEmitDate")} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Residência</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Província"
            htmlFor="residenceProvinceId"
            error={errors.residenceProvinceId?.message}
            required
          >
            <Select id="residenceProvinceId" {...register("residenceProvinceId")}>
              <option value="">Selecione...</option>
              {provincias.data?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Município"
            htmlFor="residenceMunicipalityId"
            error={errors.residenceMunicipalityId?.message}
            required
          >
            <Select
              id="residenceMunicipalityId"
              {...register("residenceMunicipalityId")}
              disabled={!provinceId}
            >
              <option value="">Selecione...</option>
              {municipios.data?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Comuna" htmlFor="residenceCommuneId" error={errors.residenceCommuneId?.message}>
            <Select
              id="residenceCommuneId"
              {...register("residenceCommuneId")}
              disabled={!municipalityId}
            >
              <option value="">Selecione...</option>
              {comunas.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Bairro"
            htmlFor="residenceNeighbourhoodId"
            error={errors.residenceNeighbourhoodId?.message}
          >
            <Select
              id="residenceNeighbourhoodId"
              {...register("residenceNeighbourhoodId")}
              disabled={!communeId}
            >
              <option value="">Selecione...</option>
              {bairros.data?.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filiação e percurso</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Habilitações" htmlFor="level" error={errors.level?.message}>
            <Input id="level" {...register("level")} />
          </Field>
          <Field label="Área de formação" htmlFor="qualification" error={errors.qualification?.message}>
            <Input id="qualification" {...register("qualification")} />
          </Field>
          <Field label="Ano de admissão" htmlFor="admissionYear" error={errors.admissionYear?.message}>
            <Input id="admissionYear" placeholder="Ex.: 2020" {...register("admissionYear")} />
          </Field>
          <Field label="Local de admissão" htmlFor="admissionPlace" error={errors.admissionPlace?.message}>
            <Input id="admissionPlace" {...register("admissionPlace")} />
          </Field>
          <Field label="Estado" htmlFor="status" error={errors.status?.message}>
            <Select id="status" {...register("status")}>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </Select>
          </Field>
          <div className="space-y-3 pt-6">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-300" {...register("wasMilitar")} />
              Foi militar
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300"
                {...register("wasMemberFromAnotherParty")}
              />
              Membro de outro partido
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}

function toFormData(member?: Member): Partial<MemberFormData> {
  if (!member) return {};
  return {
    fullName: member.fullName,
    gender: member.gender,
    birthDate: member.birthDate ?? "",
    fatherName: member.fatherName ?? "",
    motherName: member.motherName ?? "",
    bi: member.bi ?? "",
    idEmitDate: member.idEmitDate ?? "",
    phoneNumber: member.phoneNumber ?? "",
    email: member.email ?? "",
    residenceProvinceId: member.residenceProvinceId ?? "",
    residenceMunicipalityId: member.residenceMunicipalityId ?? "",
    residenceCommuneId: member.residenceCommuneId ?? "",
    residenceNeighbourhoodId: member.residenceNeighbourhoodId ?? "",
    profession: member.profession ?? "",
    qualification: member.qualification ?? "",
    level: member.level ?? "",
    admissionYear: member.admissionYear ?? "",
    admissionPlace: member.admissionPlace ?? "",
    status: member.status ?? "active",
    wasMilitar: member.wasMilitar ?? false,
    wasMemberFromAnotherParty: member.wasMemberFromAnotherParty ?? false,
  };
}
