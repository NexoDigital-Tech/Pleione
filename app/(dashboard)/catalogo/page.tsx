import { EmptyState } from "../../components/EmptyState";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { catalogoMock } from "../_mocks/data";

export default function CatalogoPage() {
  return (
    <>
      <PageHeader
        title="Catálogo"
        description="Lista mockada de serviços e produtos para composição de propostas e portal do cliente."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]">
              Gerenciar categorias
            </button>
            <button className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]">
              Novo item
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
        <header className="flex flex-col gap-2 border-b border-[color:var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Itens mockados</h2>
            <p className="text-sm text-[color:var(--color-text-muted)]">Organizados por categoria e tempo de entrega.</p>
          </div>
          <span className="rounded-full bg-[color:var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)]">
            {catalogoMock.length} itens
          </span>
        </header>
        <ul className="divide-y divide-[color:var(--color-border)]">
          {catalogoMock.map((item) => (
            <li key={item.nome} className="flex flex-col gap-2 py-4 text-sm text-[color:var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-[color:var(--color-text)]">{item.nome}</p>
                <p>Categoria: {item.categoria}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[color:var(--color-text-muted)]">
                <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">SLA {item.sla}</span>
                <button className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)]">
                  Ver detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento</h2>
          <SkeletonList items={5} />
          <SkeletonCard lines={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum item cadastrado"
            description="Cadastre itens para compor o catálogo inicial da plataforma."
            actionLabel="Criar item"
          />
        </div>
      </section>
    </>
  );
}
