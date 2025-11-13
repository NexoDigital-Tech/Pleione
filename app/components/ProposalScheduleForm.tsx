"use client";

import type { ProposalSchedule } from "../(dashboard)/propostas/data";

interface ProposalScheduleFormProps {
  value: ProposalSchedule;
  onChange: (schedule: ProposalSchedule) => void;
  error?: string;
}

export function ProposalScheduleForm({ value, onChange, error }: ProposalScheduleFormProps) {
  function updateSchedule(partial: Partial<ProposalSchedule>) {
    onChange({ ...value, ...partial });
  }

  function handlePhaseChange(index: number, key: "name" | "startDate" | "endDate" | "progress" | "owner", valueToSet: string) {
    const phases = value.phases.map((phase, phaseIndex) =>
      phaseIndex === index
        ? {
            ...phase,
            [key]: key === "progress" ? Number(valueToSet) : valueToSet,
          }
        : phase
    );
    updateSchedule({ phases });
  }

  function handleAddPhase() {
    const newPhase = {
      id: `fase-${Date.now()}`,
      name: "Nova fase",
      startDate: value.kickoff,
      endDate: value.deadline,
      progress: 0,
      owner: "",
    };

    updateSchedule({ phases: [...value.phases, newPhase] });
  }

  function handleRemovePhase(index: number) {
    updateSchedule({ phases: value.phases.filter((_, phaseIndex) => phaseIndex !== index) });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="proposal-schedule-kickoff" className="text-sm font-medium text-[color:var(--color-text)]">
            Início previsto
          </label>
          <input
            id="proposal-schedule-kickoff"
            type="date"
            value={value.kickoff}
            onChange={(event) => updateSchedule({ kickoff: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="proposal-schedule-deadline" className="text-sm font-medium text-[color:var(--color-text)]">
            Entrega final
          </label>
          <input
            id="proposal-schedule-deadline"
            type="date"
            value={value.deadline}
            onChange={(event) => updateSchedule({ deadline: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[color:var(--color-text)]">Fases</h3>
          <button
            type="button"
            onClick={handleAddPhase}
            className="text-xs font-semibold text-[color:var(--color-accent)] hover:text-[color:var(--color-accent-dark)]"
          >
            Adicionar fase
          </button>
        </div>

        {value.phases.length === 0 ? (
          <p className="text-xs text-[color:var(--color-text-muted)]">Nenhuma fase adicionada ainda.</p>
        ) : (
          <div className="space-y-4">
            {value.phases.map((phase, index) => (
              <div
                key={phase.id}
                className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[color:var(--color-text)]">{phase.name}</h4>
                  <button
                    type="button"
                    onClick={() => handleRemovePhase(index)}
                    className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-danger)] hover:text-[color:var(--color-danger)]/80"
                  >
                    Remover
                  </button>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Nome</label>
                    <input
                      value={phase.name}
                      onChange={(event) => handlePhaseChange(index, "name", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Responsável</label>
                    <input
                      value={phase.owner ?? ""}
                      onChange={(event) => handlePhaseChange(index, "owner", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Início</label>
                    <input
                      type="date"
                      value={phase.startDate}
                      onChange={(event) => handlePhaseChange(index, "startDate", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Conclusão</label>
                    <input
                      type="date"
                      value={phase.endDate}
                      onChange={(event) => handlePhaseChange(index, "endDate", event.target.value)}
                      className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[color:var(--color-text-muted)]">Progresso (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={phase.progress}
                      onChange={(event) => handlePhaseChange(index, "progress", event.target.value)}
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
