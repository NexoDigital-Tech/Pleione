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
            className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-catalog-item-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Adicionar item
          </button>
        </>
      }
    >
      <form id="new-catalog-item-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="catalogo-nome" className="text-sm font-medium text-[color:var(--color-text)]">
            Nome
          </label>
          <input
            id="catalogo-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Consultoria de Viabilidade"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="catalogo-categoria" className="text-sm font-medium text-[color:var(--color-text)]">
            Categoria
          </label>
          <input
            id="catalogo-categoria"
            value={categoria}
            onChange={(event) => setCategoria(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Serviços"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="catalogo-sla" className="text-sm font-medium text-[color:var(--color-text)]">
            SLA
          </label>
          <input
            id="catalogo-sla"
            value={sla}
            onChange={(event) => setSla(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="15 dias"
          />
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
