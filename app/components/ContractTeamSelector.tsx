"use client";

import type { ContractTeam, ContractTeamMember } from "../(dashboard)/contratos/data";

interface ContractTeamSelectorProps {
  value: ContractTeam;
  directory: ContractTeamMember[];
  onChange: (value: ContractTeam) => void;
}

const modeOptions: ContractTeam["mode"][] = ["Híbrido", "Remoto", "Presencial"];

export function ContractTeamSelector({ value, directory, onChange }: ContractTeamSelectorProps) {
  function update(partial: Partial<ContractTeam>) {
    onChange({ ...value, ...partial });
  }

  function handleOwnerChange(ownerId: string) {
    const owner = directory.find((member) => member.id === ownerId);
    if (!owner) {
      return;
    }

    const membersWithoutOwner = value.members.filter((member) => member.id !== owner.id);
    const members = ensureMember(membersWithoutOwner, owner);
    update({ owner, members });
  }

  function ensureMember(currentMembers: ContractTeamMember[], member: ContractTeamMember) {
    const exists = currentMembers.some((item) => item.id === member.id);
    return exists ? currentMembers : [...currentMembers, member];
  }

  function handleMemberToggle(memberId: string) {
    if (value.owner.id === memberId) {
      // owner is always part of the equipe
      return;
    }

    const member = directory.find((item) => item.id === memberId);
    if (!member) {
      return;
    }

    const alreadyIncluded = value.members.some((item) => item.id === memberId);
    if (alreadyIncluded) {
      update({ members: value.members.filter((item) => item.id !== memberId) });
    } else {
      update({ members: [...value.members, member] });
    }
  }

  const ownerOptions = directory.filter((member) => member.type === "Interno");
  const groupedMembers = {
    internos: directory.filter((member) => member.type === "Interno"),
    clientes: directory.filter((member) => member.type === "Cliente"),
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <span className="text-sm font-medium text-[var(--color-text)]">Modo de trabalho</span>
          <div className="flex flex-wrap gap-2">
            {modeOptions.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => update({ mode })}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  value.mode === mode
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="team-owner">
            Responsável interno
          </label>
          <select
            id="team-owner"
            value={value.owner.id}
            onChange={(event) => handleOwnerChange(event.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          >
            {ownerOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} · {member.role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium text-[var(--color-text)]">Equipe envolvida</span>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Internos
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {groupedMembers.internos.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                    value.members.some((item) => item.id === member.id)
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    disabled={member.id === value.owner.id}
                    checked={value.members.some((item) => item.id === member.id)}
                    onChange={() => handleMemberToggle(member.id)}
                    className="h-4 w-4 rounded border-[var(--color-border)]"
                  />
                  <span>
                    <span className="font-semibold">{member.name}</span>
                    <span className="block text-xs text-[var(--color-text-muted)]">{member.role}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Cliente
            </p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {groupedMembers.clientes.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                    value.members.some((item) => item.id === member.id)
                      ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                      : "border-[var(--color-border)] text-[var(--color-text)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={value.members.some((item) => item.id === member.id)}
                    onChange={() => handleMemberToggle(member.id)}
                    className="h-4 w-4 rounded border-[var(--color-border)]"
                  />
                  <span>
                    <span className="font-semibold">{member.name}</span>
                    <span className="block text-xs text-[var(--color-text-muted)]">{member.company}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="team-channel">
          Canal de comunicação principal
        </label>
        <input
          id="team-channel"
          value={value.communicationChannel}
          onChange={(event) => update({ communicationChannel: event.target.value })}
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
          placeholder="Canal no Teams"
        />
      </div>
    </div>
  );
}
