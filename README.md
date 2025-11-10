# Pleione – Sprint 1 (Casca de UI)

Interface mockada construída com Next.js (App Router) para a primeira sprint do projeto Pleione. Esta entrega contempla apenas a camada visual com rotas navegáveis, dados fictícios e componentes reutilizáveis (skeletons, estados vazios e layout base).

## Pré-requisitos

- Node.js 18+
- npm (ou pnpm/yarn/bun, conforme preferência)

## Executando o projeto

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) para navegar entre as páginas mockadas.

## Estrutura

- `app/layout.tsx`: AppShell com cabeçalho, barra lateral e breadcrumbs.
- `app/page.tsx`: dashboard inicial com overview, exemplos de skeletons e estados vazios.
- `app/(dashboard)/*`: páginas mockadas de Clientes, Empreendimentos, Propostas, Contratos, Catálogo e Portal do Cliente.
- `app/components`: biblioteca de componentes reutilizáveis (skeletons, EmptyState, PageHeader, navegação).
- `app/(dashboard)/_mocks/data.ts`: dados fictícios centralizados.
- `docs/design-system.md`: tokens de tema e padrões visuais.
- `docs/arquitetura-frontend.md`: convenções de pastas, rotas e componentes.

## Critérios de aceite atendidos

- Navegação completa entre todas as rotas mockadas.
- Skeleton loaders reutilizáveis (cards, tabelas, listas) com `animate-pulse`.
- Estados vazios padronizados via `EmptyState`.
- Layout responsivo com tema base (tokens em `app/globals.css`).
- Breadcrumbs e estrutura de pastas definidas para evolução nas próximas sprints.

## Próximos passos sugeridos

1. Implementar lógica de carregamento real com fetchers/React Query.
2. Conectar back-end ou mocks dinâmicos conforme modelagem de dados.
3. Adicionar testes de componentes (Storybook/Playwright) e validações de acessibilidade.
4. Evoluir design system com componentes interativos (tabelas com ordenação, formulários, etc.).
