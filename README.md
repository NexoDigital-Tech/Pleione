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

## Diretriz cromática 60/30/10

- **60% superfícies claras** – utilize `--color-surface`, `--color-surface-alt` e `--color-surface-muted` para backgrounds, cards e divisores. Eles reinterpretam o neutro do logotipo (`#666666`) para garantir contraste com textos (`--color-text`, `--color-text-muted`).
- **30% azul primário** – aplique `--color-primary`, `--color-primary-dark` e `--color-primary-soft` em CTAs, destaques navegacionais e estados ativos. Eles mantêm a hierarquia principal e funcionam tanto em temas claros quanto no modo dark equivalente.
- **10% rosa de acento** – reserve `--color-accent`, `--color-accent-dark` e `--color-accent-soft` para badges, botões secundários e indicadores de status. Esse limite evita competição com o primário e facilita identificar ações contextuais.

> Ao criar novos componentes, valide se a distribuição estimada permanece próxima do 60/30/10: superfícies neutras como base, azul para ações principais/feedback contínuo e rosa somente para realces pontuais.

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
