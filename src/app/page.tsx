import { redirect } from "next/navigation";

export default function Home() {
  // O middleware redireciona para /login quando não há sessão.
  redirect("/dashboard");
}
