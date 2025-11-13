"use client";

import { useMemo, useState } from "react";

import type { ProposalService, ProposalServiceTemplate } from "../(dashboard)/propostas/data";

interface ServicesSelectorProps {
  services: ProposalService[];
  catalog: ProposalServiceTemplate[];
  onChange: (services: ProposalService[]) => void;
  error?: string;
}

export function ServicesSelector({ services, catalog, onChange, error }: ServicesSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const catalogOptions = useMemo(
    () =>
      catalog.map((service) => ({
        label: `${service.name} · ${service.category}`,
        value: service.id,
      })),
    [catalog]
  );

  function handleAddTemplate() {
    const template = catalog.find((item) => item.id === selectedTemplate);
    if (!template) {
      return;
    }

    const newService: ProposalService = {
      id: `${template.id}-${Date.now()}`,
      name: template.name,
      category: template.category,
      description: template.description,
      quantity: 1,
      unitPrice: template.defaultUnitPrice,
      billingType: template.billingType,
    };

    onChange([...services, newService]);
    setSelectedTemplate("");
  }

  function handleAddCustom() {
    const newService: ProposalService = {
      id: `custom-service-${Date.now()}`,
      name: "Serviço personalizado",
      category: "Outro",
      description: "",
      quantity: 1,
      unitPrice: 0,
      billingType: "Único",
    };

    onChange([...services, newService]);
  }

  function handleUpdate(
    index: number,
    key: Exclude<keyof ProposalService, "id">,
    value: string
  ) {
    const nextServices = services.map((service, serviceIndex) =>
      serviceIndex === index
        ? {
            ...service,
            [key]:
              key === "quantity" || key === "unitPrice"
                ? Number.isNaN(Number(value))
                  ? 0
                  : Number(value)
                : value,
          }
        : service
    );
    onChange(nextServices);
  }

  function handleRemove(index: number) {
    onChange(services.filter((_, serviceIndex) => serviceIndex !== index));
  }

  const total = useMemo(
    () => services.reduce((accumulator, service) => accumulator + service.unitPrice * service.quantity, 0),
    [services]
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[color:var(--color-text)]">Adicionar serviço do catálogo</label>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            className="flex-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          >
            <option value="">Selecione um serviço</option>
            {catalogOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!selectedTemplate}
            onClick={handleAddTemplate}
            className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition enabled:hover:bg-[color:var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Incluir
          </button>
          <button
            type="button"
            onClick={handleAddCustom}
            className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
          >
            Serviço personalizado
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <p className="text-xs text-[color:var(--color-text-muted)]">
          Utilize o catálogo ou cadastre serviços personalizados para compor a proposta.
        </p>
      ) : (
        <div className="space-y-4">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[color:var(--color-text)]">{service.name}</h4>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-danger)] hover:text-[color:var(--color-danger)]/80"
                >
                  Remover
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Nome</label>
                  <input
                    value={service.name}
                    onChange={(event) => handleUpdate(index, "name", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Categoria</label>
                  <input
                    value={service.category}
                    onChange={(event) => handleUpdate(index, "category", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Descrição</label>
                  <textarea
                    value={service.description}
                    onChange={(event) => handleUpdate(index, "description", event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Tipo de cobrança</label>
                  <select
                    value={service.billingType}
                    onChange={(event) => handleUpdate(index, "billingType", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  >
                    <option value="Único">Pagamento único</option>
                    <option value="Mensal">Mensal</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Quantidade</label>
                  <input
                    type="number"
                    min={1}
                    value={service.quantity}
                    onChange={(event) => handleUpdate(index, "quantity", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Valor unitário</label>
                  <input
                    type="number"
                    min={0}
                    value={service.unitPrice}
                    onChange={(event) => handleUpdate(index, "unitPrice", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[color:var(--color-text)]">
                Total do serviço: {(service.unitPrice * service.quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl bg-[color:var(--color-surface)] p-4">
        <p className="text-sm font-semibold text-[color:var(--color-text)]">
          Total estimado: {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>

      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
    </div>
  );
}
