"use client";

import { useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewCatalogItemModal } from "../../components/NewCatalogItemModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { SkeletonList } from "../../components/skeletons/SkeletonList";
import { Toast } from "../../components/Toast";
import { catalogoMock } from "../_mocks/data";

type CatalogItem = (typeof catalogoMock)[number] & { id: string };

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function CatalogoPage() {
  const [items, setItems] = useState<CatalogItem[]>(() =>
    catalogoMock.map((item, index) => ({ ...item, id: `catalogo-${index}` }))
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(item: CatalogItem) {
    setItems((previous) => [item, ...previous]);
    setToast({ message: "Item adicionado ao catálogo.", type: "success" });
    return true;
  }

  return (
    <>
      <PageHeader
        title="Catálogo"
        description="Lista mockada de serviços e produtos para composição de propostas e portal do cliente."
        actions={
          <>
            <button className="rounded-full border border-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent)] transition hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)]">
              Gerenciar categorias
            </button>
            <button
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo item
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5 shadow-sm">
        <header className="flex flex-col gap-2 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Itens mockados</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Organizados por categoria e tempo de entrega.</p>
          </div>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {catalogoMock.length} itens
          </span>
        </header>
        <ul className="divide-y divide-[var(--color-border)]">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 py-4 text-sm text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-[var(--color-text)]">{item.nome}</p>
                <p>Categoria: {item.categoria}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1">SLA {item.sla}</span>
                <button className="rounded-full bg-[var(--color-surface-muted)] px-3 py-1 text-xs font-semibold text-[var(--color-text)]">
                  Ver detalhes
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Carregamento</h2>
          <SkeletonList items={5} />
          <SkeletonCard lines={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum item cadastrado"
            description="Cadastre itens para compor o catálogo inicial da plataforma."
            actionLabel="Criar item"
            onAction={() => setModalOpen(true)}
          />
        </div>
      </section>

      <NewCatalogItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
