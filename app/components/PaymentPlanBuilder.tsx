"use client";

import type {
  ProposalPaymentInstallment,
  ProposalPaymentPlan,
} from "../(dashboard)/propostas/data";

interface PaymentPlanBuilderProps {
  value: ProposalPaymentPlan;
  onChange: (plan: ProposalPaymentPlan) => void;
  error?: string;
}

const availableMethods = ["Pix", "Boleto", "Cartão corporativo", "Transferência bancária"];

type InstallmentKey = Exclude<keyof ProposalPaymentInstallment, "id">;

export function PaymentPlanBuilder({ value, onChange, error }: PaymentPlanBuilderProps) {
  function updatePlan(partial: Partial<ProposalPaymentPlan>) {
    onChange({ ...value, ...partial });
  }

  function handleToggleMethod(method: string) {
    const exists = value.acceptedMethods.find((item) => item.method === method);
    if (exists) {
      updatePlan({
        acceptedMethods: value.acceptedMethods.map((item) =>
          item.method === method ? { ...item, accepted: !item.accepted } : item
        ),
      });
    } else {
      updatePlan({
        acceptedMethods: [...value.acceptedMethods, { method, accepted: true }],
      });
    }
  }

  function handleInstallmentChange(index: number, key: InstallmentKey, nextValue: string) {
    const nextInstallments = value.installments.map((installment, installmentIndex) => {
      if (installmentIndex !== index) {
        return installment;
      }

      if (key === "amount") {
        const parsed = Number(nextValue);
        return { ...installment, amount: Number.isNaN(parsed) ? 0 : parsed };
      }

      if (key === "sequence") {
        const parsed = Number(nextValue);
        return { ...installment, sequence: Number.isNaN(parsed) ? installment.sequence : parsed };
      }

      if (key === "status") {
        return { ...installment, status: nextValue as ProposalPaymentInstallment["status"] };
      }

      return { ...installment, [key]: nextValue };
    });

    updatePlan({ installments: nextInstallments });
  }

  function handleAddInstallment() {
    const nextInstallment: ProposalPaymentInstallment = {
      id: `inst-${Date.now()}`,
      sequence: value.installments.length + 1,
      dueDate: "",
      amount: 0,
      status: "pending",
      method: value.acceptedMethods.find((method) => method.accepted)?.method ?? "Pix",
    };

    updatePlan({ installments: [...value.installments, nextInstallment] });
  }

  function handleRemoveInstallment(index: number) {
    updatePlan({ installments: value.installments.filter((_, installmentIndex) => installmentIndex !== index) });
  }

  const installmentsTotal = value.installments.reduce((accumulator, installment) => accumulator + installment.amount, 0);
  const difference = value.totalValue - installmentsTotal;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]">Valor total</label>
          <input
            type="number"
            min={0}
            value={value.totalValue}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              updatePlan({ totalValue: Number.isNaN(parsed) ? value.totalValue : parsed });
            }}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]">Entrada (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={value.upfrontPercentage}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              updatePlan({
                upfrontPercentage: Number.isNaN(parsed) ? value.upfrontPercentage : parsed,
              });
            }}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]">Juros (% a.m.)</label>
          <input
            type="number"
            min={0}
            step="0.1"
            value={value.interestRate}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              updatePlan({ interestRate: Number.isNaN(parsed) ? value.interestRate : parsed });
            }}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[color:var(--color-text)]">Formas de pagamento aceitas</p>
        <div className="flex flex-wrap gap-3">
          {availableMethods.map((method) => {
            const isChecked = value.acceptedMethods.some((item) => item.method === method && item.accepted);
            return (
              <button
                key={method}
                type="button"
                onClick={() => handleToggleMethod(method)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  isChecked
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]"
                    : "border-[color:var(--color-border)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {method}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Parcelas</h3>
          <button
            type="button"
            onClick={handleAddInstallment}
            className="text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-dark)]"
          >
            Adicionar parcela
          </button>
        </div>

        {value.installments.length === 0 ? (
          <p className="text-xs text-[color:var(--color-text-muted)]">Nenhuma parcela configurada.</p>
        ) : (
          <div className="space-y-4">
            {value.installments.map((installment, index) => (
              <div
                key={installment.id}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[color:var(--color-text)]">Parcela #{installment.sequence}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveInstallment(index)}
                    className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-danger)] hover:text-[color:var(--color-danger)]/80"
                  >
                    Remover
                  </button>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Número</label>
                    <input
                      type="number"
                      min={1}
                      value={installment.sequence}
                      onChange={(event) => handleInstallmentChange(index, "sequence", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Vencimento</label>
                    <input
                      type="date"
                      value={installment.dueDate}
                      onChange={(event) => handleInstallmentChange(index, "dueDate", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Valor</label>
                    <input
                      type="number"
                      min={0}
                      value={installment.amount}
                      onChange={(event) => handleInstallmentChange(index, "amount", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Forma</label>
                    <select
                      value={installment.method}
                      onChange={(event) => handleInstallmentChange(index, "method", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    >
                      {availableMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Status</label>
                    <select
                      value={installment.status}
                      onChange={(event) => handleInstallmentChange(index, "status", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="overdue">Em atraso</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-[color:var(--color-surface)] p-4 text-sm">
        <p className="font-semibold text-[color:var(--color-text)]">
          Soma das parcelas: {installmentsTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="text-[color:var(--color-text-muted)]">
          Diferença em relação ao total: {difference.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--color-text)]">Política de inadimplência</label>
        <textarea
          value={value.penaltyPolicy ?? ""}
          onChange={(event) => updatePlan({ penaltyPolicy: event.target.value })}
          rows={3}
          className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
    </div>
  );
}
