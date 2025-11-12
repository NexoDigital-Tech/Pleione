"use client";

import { useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewContratoModal } from "../../components/NewContratoModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonTable } from "../../components/skeletons/SkeletonTable";
import { Toast } from "../../components/Toast";
import { contratosMock } from "../_mocks/data";

type Contrato = (typeof contratosMock)[number] & { id: string };

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function ContratosPage() {
  const [contratos, setContratos] = useState<Contrato[]>(() =>
    contratosMock.map((contrato, index) => ({ ...contrato, id: `contrato-${index}` }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(contrato: Contrato) {
    setContratos((previous) => [contrato, ...previous]);
    setToast({ message: "Contrato criado com sucesso.", type: "success" });
    return true;
  }

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Controle mockado de contratos ativos, revisão de cláusulas e vigência."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]">
              Enviar para assinatura
            </button>
            <button
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo contrato
            </button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        {contratos.map((contrato) => (
          <article
            key={contrato.id}
            className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{contrato.codigo}</h2>
              <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-accent)]">
                {contrato.status}
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-text-muted)]">Cliente: {contrato.cliente}</p>
            <div className="rounded-lg bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text-muted)]">
              Vigência
              <p className="text-base font-semibold text-[color:var(--color-text)]">{contrato.vigencia}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-text-muted)]">
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">Revisão jurídica em 7 dias</span>
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">Última atualização há 3 dias</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento de cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard withBadge />
            <SkeletonCard lines={4} />
          </div>
          <SkeletonTable rows={3} columns={3} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum contrato disponível"
            description="Cadastre um contrato ou acompanhe o status de propostas em negociação."
            actionLabel="Criar contrato"
          />
        </div>
      </section>

      <NewContratoModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
