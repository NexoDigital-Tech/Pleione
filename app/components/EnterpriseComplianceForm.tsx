"use client";

import type { ChangeEvent } from "react";

import type {
  EnterpriseEnvProfile,
  EnterpriseFeature,
  EnterpriseFlags,
} from "../(dashboard)/empreendimentos/data";

interface EnterpriseComplianceFormProps {
  featureLibrary: EnterpriseFeature[];
  selectedFeatures: EnterpriseFeature[];
  onFeaturesChange: (features: EnterpriseFeature[]) => void;
  envProfile: EnterpriseEnvProfile;
  onEnvProfileChange: (profile: EnterpriseEnvProfile) => void;
  flags: EnterpriseFlags;
  onFlagsChange: (flags: EnterpriseFlags) => void;
}

const ENV_CLASSIFICATIONS: EnterpriseEnvProfile["classification"][] = [
  "Baixo",
  "Moderado",
  "Alto",
];

export function EnterpriseComplianceForm({
  featureLibrary,
  selectedFeatures,
  onFeaturesChange,
  envProfile,
  onEnvProfileChange,
  flags,
  onFlagsChange,
}: EnterpriseComplianceFormProps) {
  function toggleFeature(feature: EnterpriseFeature) {
    const isSelected = selectedFeatures.some((item) => item.id === feature.id);
    if (isSelected) {
      onFeaturesChange(selectedFeatures.filter((item) => item.id !== feature.id));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  }

  function handleEnvProfileChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    onEnvProfileChange({ ...envProfile, [name]: value } as EnterpriseEnvProfile);
  }

  function handleFlagChange(field: keyof EnterpriseFlags) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.target.type === "checkbox") {
        onFlagsChange({ ...flags, [field]: (event.target as HTMLInputElement).checked });
        return;
      }

      onFlagsChange({ ...flags, [field]: event.target.value });
    };
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Características operacionais</h3>
        <p className="text-sm text-[color:var(--color-text-muted)]">
          Selecione as características que descrevem o empreendimento. Elas serão exibidas nos resumos.
        </p>
        <div className="flex flex-wrap gap-2">
          {featureLibrary.map((feature) => {
            const isSelected = selectedFeatures.some((item) => item.id === feature.id);
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  isSelected
                    ? "border-[color:var(--color-accent)] bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                    : "border-[color:var(--color-border)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {feature.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Perfil ambiental</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="enterprise-env-classification" className="text-sm font-medium text-[color:var(--color-text)]">
              Classificação de risco
            </label>
            <select
              id="enterprise-env-classification"
              name="classification"
              value={envProfile.classification}
              onChange={handleEnvProfileChange}
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            >
              {ENV_CLASSIFICATIONS.map((classification) => (
                <option key={classification} value={classification}>
                  {classification}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="enterprise-env-waterUsage" className="text-sm font-medium text-[color:var(--color-text)]">
              Uso de água
            </label>
            <input
              id="enterprise-env-waterUsage"
              name="waterUsage"
              value={envProfile.waterUsage}
              onChange={handleEnvProfileChange}
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              placeholder="Sistema de reuso, poços, etc."
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="enterprise-env-energyMatrix" className="text-sm font-medium text-[color:var(--color-text)]">
              Matriz energética
            </label>
            <input
              id="enterprise-env-energyMatrix"
              name="energyMatrix"
              value={envProfile.energyMatrix}
              onChange={handleEnvProfileChange}
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              placeholder="Solar, rede pública, cogeração"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="enterprise-env-wastePlan" className="text-sm font-medium text-[color:var(--color-text)]">
              Plano de resíduos
            </label>
            <input
              id="enterprise-env-wastePlan"
              name="wastePlan"
              value={envProfile.wastePlan}
              onChange={handleEnvProfileChange}
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              placeholder="Triagem, aterro parceiro, etc."
            />
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-env-notes" className="text-sm font-medium text-[color:var(--color-text)]">
            Observações
          </label>
          <textarea
            id="enterprise-env-notes"
            name="notes"
            value={envProfile.notes ?? ""}
            onChange={handleEnvProfileChange}
            rows={3}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Pendências, recomendações de monitoramento, etc."
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Flags de compliance</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
            <input
              type="checkbox"
              checked={flags.environmentalCompliance}
              onChange={handleFlagChange("environmentalCompliance")}
              className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
            />
            <span>
              <strong className="block text-[color:var(--color-text)]">Ambiental</strong>
              <span className="text-xs text-[color:var(--color-text-muted)]">Relatórios ambientais atualizados e protocolados.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
            <input
              type="checkbox"
              checked={flags.socialCompliance}
              onChange={handleFlagChange("socialCompliance")}
              className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
            />
            <span>
              <strong className="block text-[color:var(--color-text)]">Social</strong>
              <span className="text-xs text-[color:var(--color-text-muted)]">Planos de relacionamento comunitário aprovados.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
            <input
              type="checkbox"
              checked={flags.safetyCompliance}
              onChange={handleFlagChange("safetyCompliance")}
              className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
            />
            <span>
              <strong className="block text-[color:var(--color-text)]">Segurança</strong>
              <span className="text-xs text-[color:var(--color-text-muted)]">Treinamentos e brigadas conformes com normas internas.</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
            <input
              type="checkbox"
              checked={flags.hasPendingNotifications}
              onChange={handleFlagChange("hasPendingNotifications")}
              className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
            />
            <span>
              <strong className="block text-[color:var(--color-text)]">Notificações</strong>
              <span className="text-xs text-[color:var(--color-text-muted)]">Sinalize se há notificações ou auditorias pendentes.</span>
            </span>
          </label>
        </div>
        <div className="space-y-1">
          <label htmlFor="enterprise-flags-notes" className="text-sm font-medium text-[color:var(--color-text)]">
            Observações de compliance
          </label>
          <textarea
            id="enterprise-flags-notes"
            value={flags.notes ?? ""}
            onChange={handleFlagChange("notes")}
            rows={3}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Detalhes de pendências, recomendações e acordos."
          />
        </div>
      </section>
    </div>
  );
}
