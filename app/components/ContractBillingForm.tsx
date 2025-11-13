"use client";

import type { ContractBilling } from "../(dashboard)/contratos/data";

interface ContractBillingFormProps {
  value: ContractBilling;
  onChange: (value: ContractBilling) => void;
}

export function ContractBillingForm({ value, onChange }: ContractBillingFormProps) {
  function update(partial: Partial<ContractBilling>) {
    onChange({ ...value, ...partial });
  }

  function updateTax(index: number, field: "name" | "rate", newValue: string) {
    const taxes = value.taxes.map((tax, taxIndex) =>
      taxIndex === index
        ? { ...tax, [field]: field === "rate" ? Number(newValue) : newValue }
        : tax,
    );

    update({ taxes });
  }

  function addTax() {
    update({ taxes: [...value.taxes, { name: "", rate: 0 }] });
  }

  function removeTax(index: number) {
    update({ taxes: value.taxes.filter((_, taxIndex) => taxIndex !== index) });
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="billing-total-value">
            Valor total previsto (R$)
          </label>
          <input
            id="billing-total-value"
            type="number"
            min={0}
            value={value.totalValue}
            onChange={(event) => update({ totalValue: Number(event.target.value) })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="billing-cycle">
            Ciclo de faturamento
          </label>
          <select
            id="billing-cycle"
            value={value.billingCycle}
            onChange={(event) => update({ billingCycle: event.target.value as ContractBilling["billingCycle"] })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          >
            <option value="Mensal">Mensal</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Por marco">Por marco</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[color:var(--color-text)]">Impostos e retenções</span>
          <button
            type="button"
            onClick={addTax}
            className="text-sm font-semibold text-[color:var(--color-primary)] transition hover:text-[color:var(--color-primary-dark)]"
          >
            Adicionar imposto
          </button>
        </div>

        <div className="space-y-3">
          {value.taxes.map((tax, index) => (
            <div
              key={`${tax.name}-${index}`}
              className="grid gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 md:grid-cols-[1fr_minmax(120px,160px)_auto] md:items-center"
            >
              <input
                value={tax.name}
                onChange={(event) => updateTax(index, "name", event.target.value)}
                placeholder="ISS"
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.0001}
                  value={tax.rate}
                  onChange={(event) => updateTax(index, "rate", event.target.value)}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
                <span className="text-xs text-[color:var(--color-text-muted)]">alíquota</span>
              </div>
              <button
                type="button"
                onClick={() => removeTax(index)}
                className="justify-self-end rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-[color:var(--color-danger)] transition hover:border-[color:var(--color-danger)]"
              >
                Remover
              </button>
            </div>
          ))}

          {value.taxes.length === 0 && (
            <p className="rounded-lg border border-dashed border-[color:var(--color-border)] px-3 py-4 text-sm text-[color:var(--color-text-muted)]">
              Nenhum imposto configurado. Adicione as retenções aplicáveis.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="billing-conditions">
          Condições de pagamento (uma por linha)
        </label>
        <textarea
          id="billing-conditions"
          value={value.paymentConditions.join("\n")}
          onChange={(event) =>
            update({ paymentConditions: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })
          }
          className="min-h-[100px] w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          placeholder="Entrada de 30% após assinatura"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="billing-discount-policy">
          Política de descontos ou reajustes
        </label>
        <textarea
          id="billing-discount-policy"
          value={value.discountPolicy ?? ""}
          onChange={(event) => update({ discountPolicy: event.target.value })}
          className="min-h-[80px] w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          placeholder="Reajuste anual pelo IPCA"
        />
      </div>
    </div>
  );
}
