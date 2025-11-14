'use client';

import { FormEvent, useState } from 'react';

import { Dialog } from './Dialog';

type CatalogItemPayload = {
  id: string;
  nome: string;
  categoria: string;
  sla: string;
};

interface NewCatalogItemModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: CatalogItemPayload) => boolean | void;
}

const generateId = () => `cat-${Math.random().toString(36).slice(2, 9)}`;

export function NewCatalogItemModal({ open, onClose, onSubmit }: NewCatalogItemModalProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [sla, setSla] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome || !categoria || !sla) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSubmit({ id: generateId(), nome, categoria, sla });

    if (result !== false) {
      setError('');
      setNome('');
      setCategoria('');
      setSla('');
      onClose();
    }
  }

  function handleClose() {
    setError('');
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Novo item de catálogo"
      description="Inclua serviços ou produtos para compor propostas e o portal do cliente."
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-catalog-item-form"
            className="btn-cta"
          >
            Adicionar item
          </button>
        </>
      }
    >
      <form id="new-catalog-item-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="catalogo-nome" className="text-sm font-medium text-[var(--color-text)]">
            Nome
          </label>
          <input
            id="catalogo-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Consultoria de Viabilidade"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="catalogo-categoria" className="text-sm font-medium text-[var(--color-text)]">
            Categoria
          </label>
          <input
            id="catalogo-categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Serviços"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="catalogo-sla" className="text-sm font-medium text-[var(--color-text)]">
            SLA
          </label>
          <input
            id="catalogo-sla"
            value={sla}
            onChange={(event) => setSla(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="15 dias"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
