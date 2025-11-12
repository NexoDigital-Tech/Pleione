"use client";

import { useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewClientModal } from "../../components/NewClientModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { SkeletonTable } from "../../components/skeletons/SkeletonTable";
import { Toast } from "../../components/Toast";
import { clientesMock } from "../_mocks/data";

type Cliente = (typeof clientesMock)[number] & { id: string };

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    clientesMock.map((cliente, index) => ({ ...cliente, id: `cliente-${index}` }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(cliente: Cliente) {
    setClientes((previous) => [cliente, ...previous]);
    setToast({ message: "Cliente cadastrado com sucesso.", type: "success" });
    return true;
  }

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Protótipo para navegação com dados mockados. Utilize esta base para estruturar filtros, detalhes e fluxos de cadastro nas próximas sprints."
        actions={
          <>
            <button className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]">
              Importar
            </button>
            <button
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo cliente
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-sm">
        <header className="flex flex-col gap-2 border-b border-[color:var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Clientes mockados</h2>
            <p className="text-sm text-[color:var(--color-text-muted)]">Dados fictícios para navegação e validação de layout.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-[color:var(--color-accent)]">
              Total {clientesMock.length}
            </span>
            <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[color:var(--color-text-muted)]">
              Segmentos 3
            </span>
            <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-[color:var(--color-text-muted)]">
              Última importação há 5 dias
            </span>
          </div>
        </header>
        <div className="divide-y divide-[color:var(--color-border)]">
          <div className="grid gap-4 bg-[color:var(--color-surface-alt)] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)] md:grid-cols-4">
            <span>Cliente</span>
            <span>Segmento</span>
            <span>Status</span>
            <span className="text-right">Potencial</span>
          </div>
          {clientes.map((cliente) => (
            <div key={cliente.id} className="grid gap-4 px-5 py-4 text-sm text-[color:var(--color-text-muted)] md:grid-cols-4">
              <div>
                <p className="font-medium text-[color:var(--color-text)]">{cliente.nome}</p>
                <p>Relacionamento ativo</p>
              </div>
              <span>{cliente.segmento}</span>
              <span>{cliente.fase}</span>
              <span className="text-right font-semibold text-[color:var(--color-text)]">{cliente.valorPotencial}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento padrão</h2>
          <SkeletonTable rows={3} columns={4} />
          <SkeletonList items={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum cliente neste filtro"
            description="Aplique outro critério ou cadastre um cliente manualmente."
            actionLabel="Cadastrar cliente"
          />
        </div>
      </section>

      <NewClientModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
