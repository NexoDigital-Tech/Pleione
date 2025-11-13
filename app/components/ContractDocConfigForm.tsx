"use client";

import type { ContractDocConfig } from "../(dashboard)/contratos/data";

interface ContractDocConfigFormProps {
  value: ContractDocConfig;
  onChange: (value: ContractDocConfig) => void;
}

export function ContractDocConfigForm({ value, onChange }: ContractDocConfigFormProps) {
  function update(partial: Partial<ContractDocConfig>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-name">
          Template e documento
        </label>
        <input
          id="doc-template-name"
          value={value.templateName}
          onChange={(event) => update({ templateName: event.target.value })}
          className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          placeholder="Template corporativo com addendum"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-id">
            Identificador do template
          </label>
          <input
            id="doc-template-id"
            value={value.templateId}
            onChange={(event) => update({ templateId: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="tpl-corporativo-2024"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-version">
            Versão
          </label>
          <input
            id="doc-template-version"
            value={value.version}
            onChange={(event) => update({ version: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="v1.0"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-platform">
          Plataforma de assinatura
        </label>
        <select
          id="doc-template-platform"
          value={value.signaturePlatform}
          onChange={(event) => update({ signaturePlatform: event.target.value as ContractDocConfig["signaturePlatform"] })}
          className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
        >
          <option value="Clicksign">Clicksign</option>
          <option value="DocuSign">DocuSign</option>
          <option value="Portal interno">Portal interno</option>
        </select>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
          <input
            type="checkbox"
            checked={value.requiresWitness}
            onChange={(event) => update({ requiresWitness: event.target.checked })}
            className="h-4 w-4 rounded border-[color:var(--color-border)]"
          />
          Requer testemunhas
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)]">
          <input
            type="checkbox"
            checked={value.sendForLegalReview}
            onChange={(event) => update({ sendForLegalReview: event.target.checked })}
            className="h-4 w-4 rounded border-[color:var(--color-border)]"
          />
          Enviar para revisão jurídica automaticamente
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-text)] md:col-span-2">
          <input
            type="checkbox"
            checked={value.autoReminders}
            onChange={(event) => update({ autoReminders: event.target.checked })}
            className="h-4 w-4 rounded border-[color:var(--color-border)]"
          />
          Enviar lembretes automáticos aos signatários
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-last-updated">
            Última atualização
          </label>
          <input
            id="doc-template-last-updated"
            type="date"
            value={value.lastUpdated}
            onChange={(event) => update({ lastUpdated: event.target.value })}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="doc-template-attachments">
          Anexos relacionados (um por linha)
        </label>
        <textarea
          id="doc-template-attachments"
          value={value.attachmentUrls.join("\n")}
          onChange={(event) =>
            update({ attachmentUrls: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })
          }
          className="min-h-[120px] w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          placeholder="https://files.pleione.com/anexo.pdf"
        />
      </div>
    </div>
  );
}
