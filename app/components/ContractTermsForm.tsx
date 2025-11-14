"use client";

import type { ContractTerms } from "../(dashboard)/contratos/data";

interface ContractTermsFormProps {
  value: ContractTerms;
  onChange: (value: ContractTerms) => void;
}

export function ContractTermsForm({ value, onChange }: ContractTermsFormProps) {
  function update(partial: Partial<ContractTerms>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-start-date">
            Início da vigência
          </label>
          <input
            id="contract-start-date"
            type="date"
            value={value.startDate}
            onChange={(event) => update({ startDate: event.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-end-date">
            Fim da vigência
          </label>
          <input
            id="contract-end-date"
            type="date"
            value={value.endDate}
            onChange={(event) => update({ endDate: event.target.value })}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-renewal">
          Renovação
        </label>
        <select
          id="contract-renewal"
          value={value.renewal}
          onChange={(event) => update({ renewal: event.target.value as ContractTerms["renewal"] })}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          <option value="Automática">Automática</option>
          <option value="Sob demanda">Sob demanda</option>
          <option value="Sem renovação">Sem renovação</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-responsibilities">
          Responsabilidades principais (uma por linha)
        </label>
        <textarea
          id="contract-responsibilities"
          value={value.responsibilities.join("\n")}
          onChange={(event) =>
            update({ responsibilities: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })
          }
          className="min-h-[100px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Disponibilizar equipe dedicada"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-guarantees">
          Garantias (uma por linha)
        </label>
        <textarea
          id="contract-guarantees"
          value={value.guarantees.join("\n")}
          onChange={(event) => update({ guarantees: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })}
          className="min-h-[100px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Garantia de SLA de 99%"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-clauses">
          Cláusulas-chave (uma por linha)
        </label>
        <textarea
          id="contract-clauses"
          value={value.keyClauses.join("\n")}
          onChange={(event) => update({ keyClauses: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })}
          className="min-h-[100px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Revisão anual de escopo"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="contract-notice-period">
          Prazo de aviso prévio (dias)
        </label>
        <input
          id="contract-notice-period"
          type="number"
          min={0}
          value={value.noticePeriodDays}
          onChange={(event) => update({ noticePeriodDays: Number(event.target.value) })}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>
    </div>
  );
}
