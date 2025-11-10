# Arquitetura Front-end – Sprint 1

A entrega desta sprint configura a casca de UI do projeto Pleione usando Next.js (App Router). Todos os arquivos citados estão localizados em `app/`.

## Estrutura de pastas

```
app/
├── layout.tsx                # Layout raiz com AppShell (header, sidebar, breadcrumbs)
├── page.tsx                  # Dashboard inicial com mocks e exemplos de estados
├── (dashboard)/              # Agrupador de rotas mockadas
│   ├── _mocks/               # Dados fictícios reutilizáveis
│   │   └── data.ts
│   ├── clientes/
│   │   └── page.tsx
│   ├── empreendimentos/
│   │   └── page.tsx
│   ├── propostas/
│   │   └── page.tsx
│   ├── contratos/
│   │   └── page.tsx
│   ├── catalogo/
│   │   └── page.tsx
│   └── portal-do-cliente/
│       └── page.tsx
└── components/
    ├── EmptyState.tsx
    ├── PageHeader.tsx
    ├── navigation/
    │   ├── AppHeader.tsx
    │   ├── Breadcrumbs.tsx
    │   └── Sidebar.tsx
    └── skeletons/
        ├── SkeletonCard.tsx
        ├── SkeletonList.tsx
        └── SkeletonTable.tsx
```

## Navegação

- **Sidebar** (`Sidebar.tsx`): renderiza links para todas as rotas mockadas e destaca a rota ativa.
- **Header** (`AppHeader.tsx`): mostra atalhos e controle móvel para abrir o menu.
- **Breadcrumbs** (`Breadcrumbs.tsx`): calculado com `usePathname`, seguindo a estrutura `/segmento`.

## Padrões de página

Cada rota do agrupador `(dashboard)` segue a mesma estrutura:

1. `PageHeader` com descrição e botões de ação mockados.
2. Seção principal com dados de `app/(dashboard)/_mocks/data.ts`.
3. Sessão de “Carregamento” utilizando skeletons reutilizáveis.
4. Sessão de “Estado vazio” usando `EmptyState`.

## Estados padronizados

- **Skeletons:** importados de `app/components/skeletons`. Ajuste as props `lines`, `rows`, `columns` ou `items` conforme o contexto.
- **Estado vazio:** `EmptyState` aceita `title`, `description` e um `actionLabel` opcional.

## Novas rotas

1. Criar pasta em `app/(dashboard)/nova-rota` com `page.tsx` seguindo o padrão descrito.
2. Registrar o item no array `NAV_ITEMS` de `app/layout.tsx` para aparecer na sidebar/header.
3. Incluir o label no mapa `ROUTE_LABELS` (já gerado automaticamente a partir de `NAV_ITEMS`).
4. Se necessário, adicionar mocks no arquivo `app/(dashboard)/_mocks/data.ts`.

## Execução

```bash
npm install
npm run dev
```

A aplicação será servida em `http://localhost:3000` com todas as rotas mockadas navegáveis.
