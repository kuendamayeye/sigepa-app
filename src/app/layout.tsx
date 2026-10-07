import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "SIGEPA",
  description: "Sistema de Gestão de Membros e Estruturas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
