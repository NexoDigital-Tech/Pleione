'use client';

import { FormEvent, useState } from 'react';

import { Dialog } from './Dialog';

type PortalWidgetPayload = {
  id: string;
  titulo: string;
  status: string;
  ultimaAtualizacao: string;
};

interface NewPortalWidgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (widget: PortalWidgetPayload) => boolean | void;
}

const generateId = () => `widget-${Math.random().toString(36).slice(2, 9)}`;

export function NewPortalWidgetModal({ open, onClose, onSubmit }: NewPortalWidgetModalProps) {
  const [titulo, setTitulo] = useState('');
  const [status, setStatus] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!titulo || !status || !ultimaAtualizacao) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSubmit({ id: generateId(), titulo, status, ultimaAtualizacao });

    if (result !== false) {
      setError('');
      setTitulo('');
      setStatus('');
      setUltimaAtualizacao('');
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
      title="Novo widget"
      description="Adicione um card para compor o portal do cliente."
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
            form="new-portal-widget-form"
            className="btn-cta"
          >
            Adicionar widget
          </button>
        </>
      }
    >
      <form id="new-portal-widget-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="portal-titulo" className="text-sm font-medium text-[var(--color-text)]">
            Título
          </label>
          <input
            id="portal-titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Resumo financeiro"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="portal-status" className="text-sm font-medium text-[var(--color-text)]">
            Status
          </label>
          <input
            id="portal-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="Atualizado"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="portal-ultima-atualizacao" className="text-sm font-medium text-[var(--color-text)]">
            Última atualização
          </label>
          <input
            id="portal-ultima-atualizacao"
            value={ultimaAtualizacao}
            onChange={(event) => setUltimaAtualizacao(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
            placeholder="há 2 horas"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
