# Pleione Design Tokens (Sprint 1)

A sprint inicial estabelece os tokens de design base utilizados em todo o layout mockado. Os valores abaixo estão configurados em `app/globals.css` como variáveis CSS e podem ser consumidos via Tailwind (`bg-[color:var(--token)]`).

## Cores

| Token | Valor claro | Valor escuro | Uso sugerido |
| --- | --- | --- | --- |
| `--color-surface` | `#f6f8fb` | `#111827` | Plano de fundo da aplicação |
| `--color-surface-alt` | `#ffffff` | `#1f2937` | Cartões, shells e elementos elevados |
| `--color-surface-muted` | `#eef1f6` | `#0f172a` | Skeletons, placeholders e barras de progresso |
| `--color-border` | `#d7dce5` | `#1f2937` | Bordas padrão |
| `--color-text` | `#1f2a44` | `#f9fafb` | Texto principal |
| `--color-text-muted` | `#5c6b87` | `#9ca3af` | Texto secundário |
| `--color-primary` | `#4f46e5` | `#818cf8` | Ações principais, links ativos |
| `--color-primary-dark` | `#4338ca` | `#6366f1` | Hover/foco de ações principais |
| `--color-primary-soft` | `#e0e7ff` | `rgba(99,102,241,0.14)` | Badges, fundos suaves |
| `--color-accent` | `#0ea5e9` | `#0ea5e9` | Indicadores complementares |
| `--color-success` | `#10b981` | `#10b981` | Estados positivos |
| `--color-warning` | `#f59e0b` | `#f59e0b` | Avisos |
| `--color-danger` | `#ef4444` | `#ef4444` | Erros |
| `--color-danger-soft` | `rgba(239,68,68,0.16)` | `rgba(239,68,68,0.24)` | Badges e alertas suaves |

## Espaçamentos e raios

| Token | Valor |
| --- | --- |
| `--spacing-xs` | `0.5rem` |
| `--spacing-sm` | `0.75rem` |
| `--spacing-md` | `1rem` |
| `--spacing-lg` | `1.5rem` |
| `--spacing-xl` | `2rem` |
| `--radius-sm` | `0.375rem` |
| `--radius-md` | `0.75rem` |
| `--radius-lg` | `1rem` |

## Sombra padrão

- `--shadow-soft`: `0px 10px 30px rgba(15, 23, 42, 0.06)` (modo escuro ajusta a opacidade).

## Tipografia

- Fonte base: `Geist` (importada via `next/font`).
- `body` utiliza `var(--font-geist-sans)`.
- Fontes mono disponíveis via `var(--font-geist-mono)`.

## Componentes reutilizáveis

### Skeletons
- `SkeletonCard`, `SkeletonTable`, `SkeletonList` implementam `animate-pulse` e usam `--color-surface-muted`.
- Props permitem ajustar número de linhas, colunas e itens para cenários distintos.

### Estados vazios
- Componente `EmptyState` centraliza ícone, título, descrição e CTA (`actionLabel`).
- Utilize em todas as páginas após o carregamento para indicar ausência de dados.

### Layout
- `PageHeader` entrega título, descrição e ações com espaçamento consistente.
- Header, sidebar e breadcrumbs consomem tokens para manter contraste e tipografia.

> Para novas variações, siga a convenção `bg-[color:var(--token)]` e evite valores hex fixos diretamente nos componentes.
