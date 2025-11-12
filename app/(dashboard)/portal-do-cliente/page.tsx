import { EmptyState } from "../../components/EmptyState";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { portalClienteMock } from "../_mocks/data";

export default function PortalDoClientePage() {
  return (
    <>
      <PageHeader
        title="Portal do Cliente"
        description="Protótipo da experiência do cliente final com cards de widgets, checklist e comunicação."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]">
              Pré-visualizar
            </button>
            <button className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]">
              Publicar mudanças
            </button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {portalClienteMock.map((widget) => (
          <article
            key={widget.titulo}
            className="flex flex-col gap-4 rounded-2xl bg-[color:var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]"
          >
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{widget.titulo}</h2>
              <p className="text-sm text-[color:var(--color-text-muted)]">{widget.status}</p>
            </div>
            <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text-muted)]">
              Última atualização
              <p className="text-base font-semibold text-[color:var(--color-text)]">{widget.ultimaAtualizacao}</p>
            </div>
            <button className="self-start rounded-full bg-[color:var(--color-accent-soft)] px-4 py-2 text-xs font-semibold text-[color:var(--color-accent)]">
              Configurar widget
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard lines={5} />
          </div>
          <SkeletonList items={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum widget ativo"
            description="Ative componentes para disponibilizar informações aos clientes."
            actionLabel="Adicionar widget"
          />
        </div>
      </section>
    </>
  );
}
