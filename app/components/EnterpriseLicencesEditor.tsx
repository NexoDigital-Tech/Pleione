"use client";

import { useMemo } from "react";

import type {
  EnterpriseLicence,
  EnterpriseLicenceTemplate,
} from "../(dashboard)/empreendimentos/data";

interface EnterpriseLicencesEditorProps {
  value: EnterpriseLicence[];
  onChange: (licences: EnterpriseLicence[]) => void;
  catalog: EnterpriseLicenceTemplate[];
}

const LICENCE_STATUS: EnterpriseLicence["status"][] = [
  "Ativa",
  "Em renovação",
  "Expirada",
];

export function EnterpriseLicencesEditor({ value, onChange, catalog }: EnterpriseLicencesEditorProps) {
  const valueByCatalogId = useMemo(
    () => new Map(value.map((licence) => [licence.catalogId, licence])),
    [value]
  );

  function toggleLicence(template: EnterpriseLicenceTemplate) {
    const current = valueByCatalogId.get(template.id);
    if (current) {
      onChange(value.filter((licence) => licence.catalogId !== template.id));
      return;
    }

    const now = new Date();
    const defaultValidUntil = new Date(now);
    defaultValidUntil.setMonth(now.getMonth() + template.defaultValidityMonths);

    const newLicence: EnterpriseLicence = {
      id: template.id,
      catalogId: template.id,
      name: template.name,
      issuer: template.issuer,
      category: template.category,
      status: "Ativa",
      validUntil: defaultValidUntil.toISOString().slice(0, 10),
    };

    onChange([...value, newLicence]);
  }

  function updateLicence(catalogId: string, payload: Partial<EnterpriseLicence>) {
    onChange(
      value.map((licence) =>
        licence.catalogId === catalogId
          ? {
              ...licence,
              ...payload,
            }
          : licence
      )
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-text-muted)]">
        Selecione licenças do catálogo abaixo e ajuste vigência e status conforme necessário.
      </p>
      <div className="grid gap-3">
        {catalog.map((template) => {
          const current = valueByCatalogId.get(template.id);
          return (
            <div
              key={template.id}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <input
                      id={`enterprise-licence-${template.id}`}
                      type="checkbox"
                      checked={Boolean(current)}
                      onChange={() => toggleLicence(template)}
                      className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                    <label
                      htmlFor={`enterprise-licence-${template.id}`}
                      className="text-sm font-semibold text-[var(--color-text)]"
                    >
                      {template.name}
                    </label>
                  </div>
                  <p className="ml-7 text-xs text-[var(--color-text-muted)]">{template.description}</p>
                </div>
                <div className="text-xs text-[var(--color-text-muted)]">
                  <p className="font-medium text-[var(--color-text)]">Órgão emissor</p>
                  <p>{template.issuer}</p>
                  <p className="mt-1">
                    Vigência sugerida: {template.defaultValidityMonths} meses
                  </p>
                </div>
              </div>
              {current && (
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--color-text)]">Status</label>
                    <select
                      value={current.status}
                      onChange={(event) => updateLicence(template.id, { status: event.target.value as EnterpriseLicence["status"] })}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    >
                      {LICENCE_STATUS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--color-text)]">Válido até</label>
                    <input
                      type="date"
                      value={current.validUntil}
                      onChange={(event) => updateLicence(template.id, { validUntil: event.target.value })}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--color-text)]">Categoria</label>
                    <input
                      disabled
                      value={current.category}
                      className="w-full cursor-not-allowed rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-2 text-sm text-[var(--color-text-muted)]"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
