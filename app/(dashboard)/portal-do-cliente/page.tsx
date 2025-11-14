"use client";

import { useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewPortalWidgetModal } from "../../components/NewPortalWidgetModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { Toast } from "../../components/Toast";
import { portalClienteMock } from "../_mocks/data";

type PortalWidget = (typeof portalClienteMock)[number] & { id: string };

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function PortalDoClientePage() {
  const [widgets, setWidgets] = useState<PortalWidget[]>(() =>
    portalClienteMock.map((widget, index) => ({ ...widget, id: `widget-${index}` }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(widget: PortalWidget) {
    setWidgets((previous) => [widget, ...previous]);
    setToast({ message: "Widget adicionado ao portal.", type: "success" });
    return true;
  }

  return (
    <>
      <PageHeader
        title="Portal do Cliente"
        description="Protótipo da experiência do cliente final com cards de widgets, checklist e comunicação."
        actions={
          <>
            <button className="rounded-full border border-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent)] transition hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)]">
              Pré-visualizar
            </button>
            <button
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo widget
            </button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {widgets.map((widget) => (
          <article
            key={widget.id}
            className="flex flex-col gap-4 rounded-2xl bg-[var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]"
          >
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">{widget.titulo}</h2>
              <p className="text-sm text-[var(--color-text-muted)]">{widget.status}</p>
            </div>
            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-text-muted)]">
              Última atualização
              <p className="text-base font-semibold text-[var(--color-text)]">{widget.ultimaAtualizacao}</p>
            </div>
            <button className="self-start rounded-full bg-[var(--color-accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--color-accent)]">
              Configurar widget
            </button>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Carregamento</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard lines={5} />
          </div>
          <SkeletonList items={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum widget ativo"
            description="Ative componentes para disponibilizar informações aos clientes."
            actionLabel="Adicionar widget"
            onAction={() => setModalOpen(true)}
          />
        </div>
      </section>

      <NewPortalWidgetModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
