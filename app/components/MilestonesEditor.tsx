"use client";

import type { ProposalMilestone } from "../(dashboard)/propostas/data";

interface MilestonesEditorProps {
  milestones: ProposalMilestone[];
  onChange: (milestones: ProposalMilestone[]) => void;
  error?: string;
}

type EditableMilestoneKey = Exclude<keyof ProposalMilestone, "id">;

export function MilestonesEditor({ milestones, onChange, error }: MilestonesEditorProps) {
  function handleUpdate(index: number, key: EditableMilestoneKey, value: string) {
    const nextMilestones = milestones.map((milestone, milestoneIndex) => {
      if (milestoneIndex !== index) {
        return milestone;
      }

      if (key === "status") {
        return { ...milestone, status: value as ProposalMilestone["status"] };
      }

      return { ...milestone, [key]: value };
    });
    onChange(nextMilestones);
  }

  function handleAdd() {
    const newMilestone: ProposalMilestone = {
      id: `milestone-${Date.now()}`,
      title: "Novo marco",
      expectedDate: "",
      status: "pending",
      responsible: "",
    };
    onChange([...milestones, newMilestone]);
  }

  function handleRemove(index: number) {
    onChange(milestones.filter((_, milestoneIndex) => milestoneIndex !== index));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Marcos do projeto</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-dark)]"
        >
          Adicionar marco
        </button>
      </div>

      {milestones.length === 0 ? (
        <p className="text-xs text-[color:var(--color-text-muted)]">
          Inclua datas-chave para acompanhar entregas relevantes da proposta.
        </p>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-[color:var(--color-text)]">{milestone.title}</h4>
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
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Título</label>
                  <input
                    value={milestone.title}
                    onChange={(event) => handleUpdate(index, "title", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Responsável</label>
                  <input
                    value={milestone.responsible}
                    onChange={(event) => handleUpdate(index, "responsible", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Data prevista</label>
                  <input
                    type="date"
                    value={milestone.expectedDate}
                    onChange={(event) => handleUpdate(index, "expectedDate", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Status</label>
                  <select
                    value={milestone.status}
                    onChange={(event) => handleUpdate(index, "status", event.target.value)}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  >
                    <option value="pending">Pendente</option>
                    <option value="completed">Concluído</option>
                    <option value="delayed">Em atraso</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Descrição</label>
                  <textarea
                    value={milestone.description ?? ""}
                    onChange={(event) => handleUpdate(index, "description", event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
    </div>
  );
}
