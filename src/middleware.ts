import { NextResponse, type NextRequest } from "next/server";

/**
 * Protege as rotas do sistema: sem cookie de sessão, redireciona para /login.
 * O cookie é apenas um indicador de UX — a autorização real é feita pelo
 * backend com JWT. A checagem de role aqui evita exibir telas indevidas.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get("sigepa_session")?.value === "1";
  const role = request.cookies.get("sigepa_role")?.value;

  const isLoginPage = pathname.startsWith("/login");

  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Gestão de usuários: apenas admin.
  if (pathname.startsWith("/administrativo/usuarios") && role !== "admin") {
    return NextResponse.redirect(new URL("/administrativo", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
