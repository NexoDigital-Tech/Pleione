'use client';

import { FormEvent, useState } from 'react';

import { Dialog } from './Dialog';

type EmpreendimentoPayload = {
  id: string;
  nome: string;
  cidade: string;
  fase: string;
  progresso: number;
};

interface NewEmpreendimentoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (empreendimento: EmpreendimentoPayload) => boolean | void;
}

const generateId = () => `emp-${Math.random().toString(36).slice(2, 9)}`;

export function NewEmpreendimentoModal({ open, onClose, onSubmit }: NewEmpreendimentoModalProps) {
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [fase, setFase] = useState('');
  const [progresso, setProgresso] = useState('0');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!nome || !cidade || !fase || progresso === '') {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    const progressoNumber = Number(progresso);

    if (Number.isNaN(progressoNumber) || progressoNumber < 0 || progressoNumber > 100) {
      setError('O progresso deve estar entre 0 e 100%.');
      return;
    }

    const result = onSubmit({
      id: generateId(),
      nome,
      cidade,
      fase,
      progresso: progressoNumber,
    });

    if (result !== false) {
      setError('');
      setNome('');
      setCidade('');
      setFase('');
      setProgresso('0');
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
      title="Novo empreendimento"
      description="Cadastre um empreendimento para acompanhar o andamento das etapas."
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
            form="new-empreendimento-form"
            className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
          >
            Salvar empreendimento
          </button>
        </>
      }
    >
      <form id="new-empreendimento-form" className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label htmlFor="empreendimento-nome" className="text-sm font-medium text-[color:var(--color-text)]">
            Nome
          </label>
          <input
            id="empreendimento-nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Parque das Flores"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="empreendimento-cidade" className="text-sm font-medium text-[color:var(--color-text)]">
            Cidade
          </label>
          <input
            id="empreendimento-cidade"
            value={cidade}
            onChange={(event) => setCidade(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="São Paulo"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="empreendimento-fase" className="text-sm font-medium text-[color:var(--color-text)]">
            Fase
          </label>
          <input
            id="empreendimento-fase"
            value={fase}
            onChange={(event) => setFase(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Lançamento"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="empreendimento-progresso" className="text-sm font-medium text-[color:var(--color-text)]">
            Progresso (%)
          </label>
          <input
            id="empreendimento-progresso"
            type="number"
            min={0}
            max={100}
            value={progresso}
            onChange={(event) => setProgresso(event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="45"
          />
        </div>
        {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </Dialog>
  );
}
