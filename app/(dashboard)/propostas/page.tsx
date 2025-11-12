import { EmptyState } from "../../components/EmptyState";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { SkeletonTable } from "../../components/skeletons/SkeletonTable";
import { propostasMock } from "../_mocks/data";

const statusClass: Record<string, string> = {
  "Em análise": "bg-[color:var(--color-warning)]/10 text-[color:var(--color-warning)]",
  Enviado: "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]",
  Rascunho: "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]",
};

export default function PropostasPage() {
  return (
    <>
      <PageHeader
        title="Propostas"
        description="Fluxo mockado para geração, envio e acompanhamento de propostas comerciais."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]">
              Exportar
            </button>
            <button className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]">
              Nova proposta
            </button>
          </>
        }
      />

      <section className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-sm">
        <table className="min-w-full divide-y divide-[color:var(--color-border)]">
          <thead className="bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-5 py-3 text-left">Código</th>
              <th className="px-5 py-3 text-left">Cliente</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)] text-sm text-[color:var(--color-text-muted)]">
            {propostasMock.map((proposta) => (
              <tr key={proposta.codigo}>
                <td className="px-5 py-4 font-medium text-[color:var(--color-text)]">{proposta.codigo}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-[color:var(--color-text)]">{proposta.cliente}</p>
                  <p>Último contato há 2 dias</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statusClass[proposta.status] ?? "bg-[color:var(--color-surface-muted)]"
                    }`}
                  >
                    {proposta.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-semibold text-[color:var(--color-text)]">{proposta.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento de tabela</h2>
          <SkeletonTable rows={4} columns={4} />
          <SkeletonList items={3} withAvatar={false} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhuma proposta encontrada"
            description="Cadastre uma nova proposta ou ajuste os filtros de pesquisa."
            actionLabel="Criar proposta"
          />
        </div>
      </section>
    </>
  );
}
