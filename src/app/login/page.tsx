"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { getApiErrorMessage } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data.email, data.password);
      setSubmitted(true);
      router.replace("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
            S
          </div>
          <h1 className="text-xl font-semibold text-zinc-900">SIGEPA</h1>
          <p className="text-sm text-zinc-500">
            Inicie sessão para aceder ao sistema
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="E-mail" htmlFor="email" error={errors.email?.message} required>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="nome@exemplo.com"
              {...register("email")}
            />
          </Field>

          <Field label="Senha" htmlFor="password" error={errors.password?.message} required>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
            />
          </Field>

          <Button type="submit" className="w-full" loading={isSubmitting || submitted}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-zinc-400">
          © SIGEPA — Acesso restrito a utilizadores autorizados
        </p>
      </div>
    </div>
  );
}
