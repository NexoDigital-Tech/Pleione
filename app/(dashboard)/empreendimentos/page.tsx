"use client";

import { useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewEmpreendimentoModal } from "../../components/NewEmpreendimentoModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonTable } from "../../components/skeletons/SkeletonTable";
import { Toast } from "../../components/Toast";
import { empreendimentosMock } from "../_mocks/data";

type Empreendimento = (typeof empreendimentosMock)[number] & { id: string };

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function EmpreendimentosPage() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>(() =>
    empreendimentosMock.map((item, index) => ({ ...item, id: `emp-${index}` }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(empreendimento: Empreendimento) {
    setEmpreendimentos((previous) => [empreendimento, ...previous]);
    setToast({ message: "Empreendimento cadastrado com sucesso.", type: "success" });
    return true;
  }

  return (
    <>
      <PageHeader
        title="Empreendimentos"
        description="Acompanhe lançamentos e status das obras utilizando cards e linhas do tempo mockadas."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]">
              Filtrar fases
            </button>
            <button
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo empreendimento
            </button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {empreendimentos.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{item.nome}</h2>
              <p className="text-sm text-[color:var(--color-text-muted)]">{item.cidade} • {item.fase}</p>
            </div>
            <div className="space-y-3 text-sm text-[color:var(--color-text-muted)]">
              <p>
                Próximos passos:
                <br />
                <strong className="text-[color:var(--color-text)]">Revisar memorial descritivo</strong>
              </p>
              <p>Responsável: Equipe Engenharia</p>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                <span>Progresso geral</span>
                <span>{item.progresso}%</span>
              </div>
              <div className="h-2 rounded-full bg-[color:var(--color-surface-muted)]">
                <div className="h-2 rounded-full bg-[color:var(--color-accent)]" style={{ width: `${item.progresso}%` }} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-text-muted)]">
              <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-[color:var(--color-accent)]">
                Etapa crítica
              </span>
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                5 equipes envolvidas
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento de cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard lines={4} withBadge />
            <SkeletonCard lines={5} />
          </div>
          <SkeletonTable rows={3} columns={3} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum empreendimento nesta fase"
            description="Inicie um novo projeto ou altere os filtros para visualizar outros resultados."
            actionLabel="Cadastrar empreendimento"
          />
        </div>
      </section>

      <NewEmpreendimentoModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
