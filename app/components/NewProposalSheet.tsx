'use client';

import { FormEvent, useState } from 'react';

import { Drawer } from './Drawer';

type ProposalPayload = {
  codigo: string;
  cliente: string;
  status: string;
  valor: string;
};

interface NewProposalSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposta: ProposalPayload) => boolean | void;
}

export function NewProposalSheet({ open, onClose, onSubmit }: NewProposalSheetProps) {
  const [codigo, setCodigo] = useState('');
  const [cliente, setCliente] = useState('');
  const [status, setStatus] = useState('Em análise');
  const [valor, setValor] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!codigo || !cliente || !status || !valor) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSubmit({ codigo, cliente, status, valor });

    if (result !== false) {
      setError('');
      setCodigo('');
      setCliente('');
      setStatus('Em análise');
      setValor('');
      onClose();
    }
  }

  function handleClose() {
    setError('');
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Nova proposta"
      description="Defina o código, cliente e status para controlar o funil comercial."
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="new-proposal-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Criar proposta
          </button>
        </div>
      }
    >
      <form id="new-proposal-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="proposta-codigo" className="text-sm font-medium text-[color:var(--color-text)]">
            Código
          </label>
          <input
            id="proposta-codigo"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="PR-2050"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="proposta-cliente" className="text-sm font-medium text-[color:var(--color-text)]">
            Cliente
          </label>
          <input
            id="proposta-cliente"
            value={cliente}
            onChange={(event) => setCliente(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Residencial Aurora"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="proposta-status" className="text-sm font-medium text-[color:var(--color-text)]">
            Status
          </label>
          <select
            id="proposta-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          >
            <option>Em análise</option>
            <option>Enviado</option>
            <option>Rascunho</option>
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="proposta-valor" className="text-sm font-medium text-[color:var(--color-text)]">
            Valor
          </label>
          <input
            id="proposta-valor"
            value={valor}
            onChange={(event) => setValor(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="R$ 500K"
          />
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Drawer>
  );
}
