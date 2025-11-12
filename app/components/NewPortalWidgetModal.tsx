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
            className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-portal-widget-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Adicionar widget
          </button>
        </>
      }
    >
      <form id="new-portal-widget-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="portal-titulo" className="text-sm font-medium text-[color:var(--color-text)]">
            Título
          </label>
          <input
            id="portal-titulo"
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Resumo financeiro"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="portal-status" className="text-sm font-medium text-[color:var(--color-text)]">
            Status
          </label>
          <input
            id="portal-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Atualizado"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="portal-ultima-atualizacao" className="text-sm font-medium text-[color:var(--color-text)]">
            Última atualização
          </label>
          <input
            id="portal-ultima-atualizacao"
            value={ultimaAtualizacao}
            onChange={(event) => setUltimaAtualizacao(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="há 2 horas"
          />
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
