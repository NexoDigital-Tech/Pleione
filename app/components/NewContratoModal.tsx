'use client';

import { FormEvent, useState } from 'react';

import { Dialog } from './Dialog';

export type ContratoPayload = {
  id: string;
  codigo: string;
  cliente: string;
  vigencia: string;
  status: string;
  valorTotal?: number;
};

interface NewContratoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (contrato: ContratoPayload) => boolean | void;
}

const generateId = () => `ct-${Math.random().toString(36).slice(2, 9)}`;

export function NewContratoModal({ open, onClose, onSubmit }: NewContratoModalProps) {
  const [codigo, setCodigo] = useState('');
  const [cliente, setCliente] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [status, setStatus] = useState('Ativo');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!codigo || !cliente || !vigencia || !status) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const result = onSubmit({ id: generateId(), codigo, cliente, vigencia, status });

    if (result !== false) {
      setError('');
      setCodigo('');
      setCliente('');
      setVigencia('');
      setStatus('Ativo');
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
      title="Novo contrato"
      description="Cadastre um contrato com informações de vigência e status."
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
            form="new-contrato-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Salvar contrato
          </button>
        </>
      }
    >
      <form id="new-contrato-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="contrato-codigo" className="text-sm font-medium text-[color:var(--color-text)]">
            Código
          </label>
          <input
            id="contrato-codigo"
            value={codigo}
            onChange={(event) => setCodigo(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="CT-910"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contrato-cliente" className="text-sm font-medium text-[color:var(--color-text)]">
            Cliente
          </label>
          <input
            id="contrato-cliente"
            value={cliente}
            onChange={(event) => setCliente(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Residencial Aurora"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contrato-vigencia" className="text-sm font-medium text-[color:var(--color-text)]">
            Vigência
          </label>
          <input
            id="contrato-vigencia"
            value={vigencia}
            onChange={(event) => setVigencia(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="2024-2027"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contrato-status" className="text-sm font-medium text-[color:var(--color-text)]">
            Status
          </label>
          <select
            id="contrato-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          >
            <option>Ativo</option>
            <option>Revisão</option>
            <option>Encerrado</option>
          </select>
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
