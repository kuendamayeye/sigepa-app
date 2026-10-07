# SIGEPA — Sistema de Gestão

Aplicação web construída com **Next.js (App Router) + TypeScript + Tailwind CSS**, preparada para consumir uma **API real** (NestJS/REST).

## Módulos incluídos

- **Login / Autenticação** — JWT (access + refresh token), guarda de rotas via middleware
- **Dashboard** — estatísticas de membros, órgãos, estruturas e usuários
- **Membros** — listagem, criação, detalhe, edição, ativar/desativar, remoção
- **Órgãos** — órgãos, tipos de órgão e funções
- **Estruturas** — estruturas, núcleos e comités (local, sectorial, zonal)
- **Administrativo** — usuários (apenas admin), idiomas, línguas e formações

> O módulo de finanças foi deliberadamente excluído do âmbito actual.

## Roles e permissões

| Permissão | admin | operador | visualizador |
|---|---|---|---|
| Ver módulos | ✅ | ✅ | ✅ |
| Criar/editar/remover (membros, órgãos, estruturas) | ✅ | ✅ | ❌ |
| Gerir catálogos administrativos | ✅ | ✅ | ❌ |
| Gerir usuários | ✅ | ❌ | ❌ |

A matriz está num único ficheiro: [`src/lib/permissions.ts`](src/lib/permissions.ts) — para adicionar um role ou permissão, basta alterar esse ficheiro.

- **Fronteira UX:** componentes/escondem botões (`<Can permission="...">` / `usePermission`) e o `src/middleware.ts` bloqueia navegação sem cookie de sessão (e `/administrativo/usuarios` a não-admins).
- **Fronteira real:** o backend valida o JWT e as permissões — o frontend nunca é a única barreira.

## Configuração

```bash
cp .env.example .env.local   # ajuste a URL da API
npm install
npm run dev
```

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API | `http://localhost:3333/api/v1` |

## Estrutura

```
src/
├── app/                  # rotas (App Router)
│   ├── login/            # página pública de login
│   └── (app)/            # rotas autenticadas (dashboard, membros, orgaos, ...)
├── components/
│   ├── ui/               # primitivos (botão, tabela, modal, estados...)
│   ├── crud/             # página de CRUD reutilizável (listas simples)
│   ├── layout/           # navbar, sidebar, shell com guard
│   └── membros/          # formulário de membro (partilhado novo/editar)
├── context/              # AuthProvider (sessão, login, logout, permissões)
├── hooks/                # hooks React Query por domínio
├── lib/                  # cliente axios, sessão, permissões, utils
├── services/             # funções de acesso à API (1 ficheiro por domínio)
└── types/                # tipos partilhados
```

## Convenções

- **Dados:** TanStack Query (queries com `queryKey` incluindo filtros, mutações com invalidação + toast).
- **Formulários:** react-hook-form + zod (validação mensagens em PT).
- **Erros:** sempre traduzidos com `getApiErrorMessage` — nunca `catch` silencioso.
- **Sem duplicação:** as listas simples usam `CrudListPage` (lista + modal criar/editar + confirmação de remoção).

## Scripts

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm run lint       # eslint
npm run typecheck  # verificação de tipos
```
