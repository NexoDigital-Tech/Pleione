'use client';

import { FormEvent, useState } from 'react';

import { Dialog } from './Dialog';

type ClientPayload = {
  id: string;
  nome: string;
  segmento: string;
  fase: string;
  valorPotencial: string;
};

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cliente: ClientPayload) => boolean | void;
}

const generateId = () => `cli-${Math.random().toString(36).slice(2, 9)}`;

export function NewClientModal({ open, onClose, onSubmit }: NewClientModalProps) {
  const [nome, setNome] = useState('');
  const [segmento, setSegmento] = useState('');
  const [fase, setFase] = useState('');
  const [valorPotencial, setValorPotencial] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome || !segmento || !fase || !valorPotencial) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSubmit({
      id: generateId(),
      nome,
      segmento,
      fase,
      valorPotencial,
    });

    if (result !== false) {
      setError('');
      setNome('');
      setSegmento('');
      setFase('');
      setValorPotencial('');
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
      title="Novo cliente"
      description="Informe os principais dados do cliente para incluí-lo na lista."
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
            form="new-client-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Salvar cliente
          </button>
        </>
      }
    >
      <form id="new-client-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="cliente-nome" className="text-sm font-medium text-[color:var(--color-text)]">
            Nome
          </label>
          <input
            id="cliente-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Construtora Horizonte"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="cliente-segmento" className="text-sm font-medium text-[color:var(--color-text)]">
            Segmento
          </label>
          <input
            id="cliente-segmento"
            value={segmento}
            onChange={(event) => setSegmento(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Incorporação"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="cliente-fase" className="text-sm font-medium text-[color:var(--color-text)]">
            Fase
          </label>
          <input
            id="cliente-fase"
            value={fase}
            onChange={(event) => setFase(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Ativo"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="cliente-valor" className="text-sm font-medium text-[color:var(--color-text)]">
            Valor potencial
          </label>
          <input
            id="cliente-valor"
            value={valorPotencial}
            onChange={(event) => setValorPotencial(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="R$ 1,2M"
          />
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
