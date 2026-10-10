"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "react-toastify";
import { DEMO_MODE } from "@/lib/demo";

const COVER_IMAGE = "/images/bandeira.png"; // ajuste para a sua imagem

// 🎯 Schema de validação com zod
const loginSchema = z.object({
  email: z.string().email("Insira um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // react-hook-form integrado com zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password); // espera o login terminar
      router.push("/membros"); // só redireciona se sucesso
    } catch {
      toast.error("Credenciais inválidas.");
      // erro já é mostrado pelo toast dentro de useAuth
      // aqui apenas previne que a exceção "vaze" e cause reload
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 👈 Isso previne o reload da página
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Coluna Esquerda */}
      <div className="hidden md:flex w-1/2 h-full flex-col bg-gradient-to-br from-green-800 via-slate-900 to-black text-white">
        <div className="my-24 text-center flex flex-col px-6">
          <p className="text-lg font-semibold">
            2025 - ANO DE UNIDADE NACIONAL PARA ALTERNÂNCIA DO PODER!
          </p>
        </div>

        <div className="relative inset-0 flex">
          <Image
            src={COVER_IMAGE}
            alt="Capa do sistema"
            width={400}
            height={400}
            className="object-contain m-auto drop-shadow-lg"
            priority
          />
        </div>

        <div className="my-10 text-center flex flex-col px-6">
          <h1 className="text-xl font-bold my-4">
            Organizar para melhor gerir
          </h1>
          <p className="text-lg font-normal opacity-90">
            Conectando e Fortalecendo - Gestão Integrada para um Partido Unido!
          </p>
        </div>
      </div>

      {/* Coluna Direita (sempre aparece) */}
      <div className="w-full md:w-1/2 h-full bg-gradient-to-br flex flex-col items-center justify-center p-8 md:p-20">
        {/* Branding */}
        <h1 className="text-3xl font-bold text-green-800 mb-2">SIGEPA</h1>
        <p className="text-gray-600 mb-10 text-center">
          Sistema Integrado de Gestão Partidária
        </p>

        {/* Título */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-semibold text-gray-900 mb-2">
            Seja Bem-Vindo!
          </h3>
          <p className="text-base text-gray-600">
            Por favor, insira as suas credenciais.
          </p>
        </div>

        {/* Formulário */}
        {DEMO_MODE && (
          <p className="mb-6 w-full max-w-md rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-800">
            Modo demonstração activo — entre com qualquer email e palavra-passe
            (mín. 6 caracteres). Não é necessário backend.
          </p>
        )}
        <form
          onSubmit={handleFormSubmit}
          className="w-full max-w-md space-y-6"
          autoComplete="off"
        >
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              autoComplete="new-email"
              disabled={isSubmitting}
              {...register("email")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Palavra-Passe"
              disabled={isSubmitting}
              {...register("password")}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute inset-y-0 right-3 z-10 flex items-center text-gray-500 hover:text-green-700"
            >
              <i
                className={`fa-solid ${
                  isPasswordVisible ? "fa-eye-slash" : "fa-eye"
                }`}
              ></i>
            </button>

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Opções extras */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 mr-2 text-green-600 rounded"
              />
              Lembrar palavra-passe
            </label>
            <button type="button" className="text-green-700 hover:underline">
              Esqueci a palavra-passe
            </button>
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center transition-colors"
          >
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {isSubmitting ? "A Entrar..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
