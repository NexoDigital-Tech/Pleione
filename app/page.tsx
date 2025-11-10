import { EmptyState } from "./components/EmptyState";
import { PageHeader } from "./components/PageHeader";
import { SkeletonCard } from "./components/skeletons/SkeletonCard";
import { SkeletonList } from "./components/skeletons/SkeletonList";
import { SkeletonTable } from "./components/skeletons/SkeletonTable";
import {
  catalogoMock,
  clientesMock,
  contratosMock,
  empreendimentosMock,
  portalClienteMock,
  propostasMock,
} from "./(dashboard)/_mocks/data";

const highlights = [
  { label: "Clientes ativos", value: "128", helper: "+12% vs. mês anterior" },
  { label: "Propostas em negociação", value: "37", helper: "R$ 4,3M em pipeline" },
  { label: "Empreendimentos acompanhados", value: "18", helper: "5 lançamentos este mês" },
  { label: "Satisfação clientes", value: "92", helper: "NPS consolidado" },
];

const agenda = [
  { titulo: "Reunião de kick-off", data: "Hoje • 10h", equipe: "Equipe Comercial" },
  { titulo: "Envio de contrato", data: "Hoje • 15h", equipe: "Jurídico" },
  { titulo: "Follow-up Catálogo", data: "Amanhã • 09h", equipe: "Produto" },
];

export default function Home() {
  return (
    <>
      <PageHeader
        title="Central Pleione"
        description="Visão consolidada do pipeline comercial, empreendimentos e relacionamento com clientes. Navegue pelos módulos para acessar os protótipos e estados padronizados."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]">
              Personalizar layout
            </button>
            <button className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]">
              Criar registro
            </button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {highlights.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl bg-[color:var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              {item.label}
            </span>
            <p className="mt-3 text-3xl font-semibold text-[color:var(--color-text)]">{item.value}</p>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Empreendimentos em destaque</h2>
              <p className="text-sm text-[color:var(--color-text-muted)]">
                Baseado nos mockups disponíveis para navegação.
              </p>
            </div>
            <button className="hidden rounded-full border border-[color:var(--color-border)] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] lg:block">
              Ver todos
            </button>
          </header>
          <div className="grid gap-4 md:grid-cols-2">
            {empreendimentosMock.map((empreendimento) => (
              <article
                key={empreendimento.nome}
                className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5"
              >
                <div>
                  <h3 className="text-lg font-semibold text-[color:var(--color-text)]">
                    {empreendimento.nome}
                  </h3>
                  <p className="text-sm text-[color:var(--color-text-muted)]">
                    {empreendimento.cidade} • {empreendimento.fase}
                  </p>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                    <span>Progresso</span>
                    <span>{empreendimento.progresso}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[color:var(--color-surface-muted)]">
                    <div
                      className="h-2 rounded-full bg-[color:var(--color-primary)]"
                      style={{ width: `${empreendimento.progresso}%` }}
                    />
                  </div>
                </div>
                <button className="self-start rounded-full bg-[color:var(--color-primary-soft)] px-4 py-2 text-xs font-semibold text-[color:var(--color-primary)]">
                  Abrir protótipo
                </button>
              </article>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl bg-[color:var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Agenda mockada</h2>
            <ul className="mt-4 space-y-4 text-sm text-[color:var(--color-text-muted)]">
              {agenda.map((item) => (
                <li key={item.titulo} className="flex flex-col gap-1">
                  <span className="font-medium text-[color:var(--color-text)]">{item.titulo}</span>
                  <span>{item.data}</span>
                  <span>{item.equipe}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5">
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estados padronizados</h2>
            <p className="mt-2 text-sm text-[color:var(--color-text-muted)]">
              Utilize os componentes abaixo para simular carregamento e vazio em todas as páginas.
            </p>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Exemplo de carregamento (skeleton)</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard withBadge />
            <SkeletonList />
          </div>
          <SkeletonTable rows={4} columns={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nada por aqui ainda"
            description="Use este padrão sempre que não houver dados disponíveis após o carregamento inicial."
            actionLabel="Adicionar item"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Panorama rápido</h2>
          <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-text-muted)]">
            <li>Clientes mockados: {clientesMock.length}</li>
            <li>Propostas mockadas: {propostasMock.length}</li>
            <li>Contratos mockados: {contratosMock.length}</li>
            <li>Itens de catálogo mockados: {catalogoMock.length}</li>
            <li>Widgets portal cliente: {portalClienteMock.length}</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Guia rápido</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[color:var(--color-text-muted)]">
            <li>Navegue pelos módulos via barra lateral ou breadcrumbs.</li>
            <li>Utilize os componentes de skeleton para loading.</li>
            <li>Replique o estado vazio conforme padrão ao lado.</li>
            <li>Mantenha dados mockados em `app/(dashboard)/_mocks`.</li>
          </ol>
        </div>
      </section>
    </>
  );
}
