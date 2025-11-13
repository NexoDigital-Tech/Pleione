"use client";

import type { ProposalApproval, ProposalApprovalStep } from "../(dashboard)/propostas/data";

interface ProposalApprovalChecklistProps {
  value: ProposalApproval;
  onChange: (approval: ProposalApproval) => void;
  error?: string;
}

type EditableApprovalKey = Exclude<keyof ProposalApprovalStep, "id">;

export function ProposalApprovalChecklist({ value, onChange, error }: ProposalApprovalChecklistProps) {
  function updateApproval(partial: Partial<ProposalApproval>) {
    onChange({ ...value, ...partial });
  }

  function handleStepChange(index: number, key: EditableApprovalKey, nextValue: string) {
    const nextSteps = value.steps.map((step, stepIndex) => {
      if (stepIndex !== index) {
        return step;
      }

      if (key === "status") {
        return { ...step, status: nextValue as ProposalApprovalStep["status"] };
      }

      return { ...step, [key]: nextValue };
    });

    updateApproval({ steps: nextSteps });
  }

  function handleAddStep() {
    const newStep: ProposalApprovalStep = {
      id: `approval-step-${Date.now()}`,
      area: "",
      approver: "",
      status: "pending",
      dueDate: "",
      notes: "",
    };
    updateApproval({ steps: [...value.steps, newStep] });
  }

  function handleRemoveStep(index: number) {
    updateApproval({ steps: value.steps.filter((_, stepIndex) => stepIndex !== index) });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]">Nome do fluxo</label>
          <input
            value={value.flowName}
            onChange={(event) => updateApproval({ flowName: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]">Observações</label>
          <textarea
            value={value.observations ?? ""}
            onChange={(event) => updateApproval({ observations: event.target.value })}
            rows={2}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Contato principal</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Nome</label>
            <input
              value={value.mainContact.name}
              onChange={(event) =>
                updateApproval({
                  mainContact: { ...value.mainContact, name: event.target.value },
                })
              }
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Cargo</label>
            <input
              value={value.mainContact.role}
              onChange={(event) =>
                updateApproval({
                  mainContact: { ...value.mainContact, role: event.target.value },
                })
              }
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[color:var(--color-text-muted)]">E-mail</label>
            <input
              type="email"
              value={value.mainContact.email}
              onChange={(event) =>
                updateApproval({
                  mainContact: { ...value.mainContact, email: event.target.value },
                })
              }
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Telefone</label>
            <input
              value={value.mainContact.phone}
              onChange={(event) =>
                updateApproval({
                  mainContact: { ...value.mainContact, phone: event.target.value },
                })
              }
              className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Etapas de aprovação</h3>
          <button
            type="button"
            onClick={handleAddStep}
            className="text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-dark)]"
          >
            Adicionar etapa
          </button>
        </div>

        {value.steps.length === 0 ? (
          <p className="text-xs text-[color:var(--color-text-muted)]">Nenhuma etapa cadastrada.</p>
        ) : (
          <div className="space-y-4">
            {value.steps.map((step, index) => (
              <div
                key={step.id}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[color:var(--color-text)]">
                    {step.area || `Etapa ${index + 1}`}
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(index)}
                    className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-danger)] hover:text-[color:var(--color-danger)]/80"
                  >
                    Remover
                  </button>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Área</label>
                    <input
                      value={step.area}
                      onChange={(event) => handleStepChange(index, "area", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Aprovador</label>
                    <input
                      value={step.approver}
                      onChange={(event) => handleStepChange(index, "approver", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Prazo</label>
                    <input
                      type="date"
                      value={step.dueDate}
                      onChange={(event) => handleStepChange(index, "dueDate", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Status</label>
                    <select
                      value={step.status}
                      onChange={(event) => handleStepChange(index, "status", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    >
                      <option value="pending">Pendente</option>
                      <option value="approved">Aprovado</option>
                      <option value="rejected">Reprovado</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Observações</label>
                    <textarea
                      value={step.notes ?? ""}
                      onChange={(event) => handleStepChange(index, "notes", event.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
    </div>
  );
}
