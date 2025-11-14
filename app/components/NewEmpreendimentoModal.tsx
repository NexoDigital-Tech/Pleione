"use client";

import { useMemo, useState } from "react";

import {
  ENTERPRISE_CLIENTS,
  ENTERPRISE_FEATURE_LIBRARY,
  ENTERPRISE_LICENCE_CATALOG,
  ENTERPRISE_PHASES,
  ENTERPRISE_STATUSES,
  type Enterprise,
  type EnterpriseContact,
  type EnterpriseDraft,
  createEmptyEnterpriseDraft,
  createEnterpriseFromDraft,
} from "../(dashboard)/empreendimentos/data";
import { Dialog } from "./Dialog";
import { EnterpriseComplianceForm } from "./EnterpriseComplianceForm";
import { EnterpriseDocumentsUploader } from "./EnterpriseDocumentsUploader";
import { EnterpriseLicencesEditor } from "./EnterpriseLicencesEditor";
import { EnterpriseLocationForm } from "./EnterpriseLocationForm";

interface NewEmpreendimentoModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (enterprise: Enterprise) => boolean | void;
  contacts: EnterpriseContact[];
}

const STEP_LABELS = [
  "Dados gerais",
  "Localização",
  "Operação & compliance",
  "Licenças",
  "Documentos",
];

export function NewEmpreendimentoModal({ open, onClose, onSubmit, contacts }: NewEmpreendimentoModalProps) {
  const [draft, setDraft] = useState<EnterpriseDraft>(() => createEmptyEnterpriseDraft());
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const availableContacts = useMemo(
    () => contacts.filter((contact) => contact.clientId === draft.clientId),
    [contacts, draft.clientId]
  );

  function resetState() {
    setDraft(createEmptyEnterpriseDraft());
    setStepIndex(0);
    setError(null);
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function updateDraft<K extends keyof EnterpriseDraft>(key: K, value: EnterpriseDraft[K]) {
    setDraft((previous) => ({ ...previous, [key]: value }));
  }

  function validateDraft(current: EnterpriseDraft) {
    if (!current.name.trim()) {
      return "Informe o nome do empreendimento.";
    }

    if (!current.code.trim()) {
      return "Informe o código interno.";
    }

    if (!current.clientId) {
      return "Selecione um cliente relacionado.";
    }

    if (!current.phase) {
      return "Selecione a fase do empreendimento.";
    }

    if (!current.status) {
      return "Defina o status de conformidade.";
    }

    if (!current.location.city.trim() || !current.location.state.trim()) {
      return "Informe cidade e estado na aba de localização.";
    }

    return null;
  }

  function handleNextStep() {
    setError(null);
    setStepIndex((previous) => Math.min(previous + 1, STEP_LABELS.length - 1));
  }

  function handlePreviousStep() {
    setError(null);
    setStepIndex((previous) => Math.max(previous - 1, 0));
  }

  function handleSave() {
    const validationMessage = validateDraft(draft);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const result = onSubmit(createEnterpriseFromDraft(draft));

    if (result !== false) {
      resetState();
      onClose();
    }
  }

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_LABELS.length - 1;

  const stepContent = (() => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="enterprise-name" className="text-sm font-medium text-[var(--color-text)]">
                Nome do empreendimento
              </label>
              <input
                id="enterprise-name"
                value={draft.name}
                onChange={(event) => updateDraft("name", event.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Novo empreendimento residencial"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="enterprise-code" className="text-sm font-medium text-[var(--color-text)]">
                  Código interno
                </label>
                <input
                  id="enterprise-code"
                  value={draft.code}
                  onChange={(event) => updateDraft("code", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="EMP-210"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="enterprise-manager" className="text-sm font-medium text-[var(--color-text)]">
                  Gestor responsável
                </label>
                <input
                  id="enterprise-manager"
                  value={draft.manager}
                  onChange={(event) => updateDraft("manager", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="enterprise-phase" className="text-sm font-medium text-[var(--color-text)]">
                  Fase
                </label>
                <select
                  id="enterprise-phase"
                  value={draft.phase}
                  onChange={(event) => updateDraft("phase", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  {ENTERPRISE_PHASES.map((phase) => (
                    <option key={phase} value={phase}>
                      {phase}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="enterprise-status" className="text-sm font-medium text-[var(--color-text)]">
                  Status de conformidade
                </label>
                <select
                  id="enterprise-status"
                  value={draft.status}
                  onChange={(event) => updateDraft("status", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  {ENTERPRISE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="enterprise-client" className="text-sm font-medium text-[var(--color-text)]">
                  Cliente relacionado
                </label>
                <select
                  id="enterprise-client"
                  value={draft.clientId}
                  onChange={(event) => {
                    const clientId = event.target.value;
                    setDraft((previous) => {
                      const contactsForClient = contacts.filter((contact) => contact.clientId === clientId);
                      const keepContact = contactsForClient.some((contact) => contact.id === previous.contactId);
                      return {
                        ...previous,
                        clientId,
                        contactId: keepContact ? previous.contactId : undefined,
                      };
                    });
                  }}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  {ENTERPRISE_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label htmlFor="enterprise-contact" className="text-sm font-medium text-[var(--color-text)]">
                  Contato principal
                </label>
                <select
                  id="enterprise-contact"
                  value={draft.contactId ?? ""}
                  onChange={(event) => updateDraft("contactId", event.target.value || undefined)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                >
                  <option value="">Selecionar contato</option>
                  {availableContacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} • {contact.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="enterprise-startDate" className="text-sm font-medium text-[var(--color-text)]">
                  Data de início
                </label>
                <input
                  id="enterprise-startDate"
                  type="date"
                  value={draft.startDate}
                  onChange={(event) => updateDraft("startDate", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]">Progresso</label>
                <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={draft.progress}
                    onChange={(event) => updateDraft("progress", Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-surface-muted)]"
                  />
                  <span className="w-10 text-right text-sm font-semibold text-[var(--color-text)]">{draft.progress}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="enterprise-description" className="text-sm font-medium text-[var(--color-text)]">
                Descrição
              </label>
              <textarea
                id="enterprise-description"
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Resumo das características do empreendimento"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-text)]">Score de compliance</label>
              <div className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={draft.complianceScore}
                  onChange={(event) => updateDraft("complianceScore", Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-surface-muted)]"
                />
                <span className="w-10 text-right text-sm font-semibold text-[var(--color-text)]">{draft.complianceScore}%</span>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <EnterpriseLocationForm
            value={draft.location}
            onChange={(value) => updateDraft("location", value)}
          />
        );
      case 2:
        return (
          <EnterpriseComplianceForm
            featureLibrary={ENTERPRISE_FEATURE_LIBRARY}
            selectedFeatures={draft.features}
            onFeaturesChange={(features) => updateDraft("features", features)}
            envProfile={draft.envProfile}
            onEnvProfileChange={(profile) => updateDraft("envProfile", profile)}
            flags={draft.flags}
            onFlagsChange={(flags) => updateDraft("flags", flags)}
          />
        );
      case 3:
        return (
          <EnterpriseLicencesEditor
            value={draft.licences}
            onChange={(licences) => updateDraft("licences", licences)}
            catalog={ENTERPRISE_LICENCE_CATALOG}
          />
        );
      case 4:
        return (
          <EnterpriseDocumentsUploader
            value={draft.documents}
            onChange={(documents) => updateDraft("documents", documents)}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Novo empreendimento"
      description="Cadastre um empreendimento com dados operacionais, compliance e documentos relacionados."
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
          >
            Cancelar
          </button>
          {!isFirstStep && (
            <button
              type="button"
              onClick={handlePreviousStep}
              className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              Voltar
            </button>
          )}
          <button
            type="button"
            onClick={isLastStep ? handleSave : handleNextStep}
            className="btn-cta"
          >
            {isLastStep ? "Salvar empreendimento" : "Avançar"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <ol className="flex flex-wrap gap-2 text-xs font-medium">
          {STEP_LABELS.map((label, index) => {
            const isActive = index === stepIndex;
            const isCompleted = index < stepIndex;
            return (
              <li
                key={label}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 ${
                  isActive
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : isCompleted
                    ? "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)]">
                  {index + 1}
                </span>
                {label}
              </li>
            );
          })}
        </ol>

        {stepContent}

        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    </Dialog>
  );
}
