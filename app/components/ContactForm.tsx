"use client";

import { ContactChannel } from "@/app/types/client";

export type ContactDraft = {
  id?: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  preferredChannels: ContactChannel[];
  notes: string;
  isPrimary: boolean;
  receiveNotifications: boolean;
};

interface ContactFormProps {
  value: ContactDraft;
  onChange: (value: ContactDraft) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  errors?: Partial<Record<keyof ContactDraft | "form", string>>;
}

const CHANNEL_LABELS: Record<ContactChannel, string> = {
  email: "E-mail",
  phone: "Telefone",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

export function ContactForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  submitLabel = "Adicionar contato",
  errors,
}: ContactFormProps) {
  function updateField<K extends keyof ContactDraft>(field: K, fieldValue: ContactDraft[K]) {
    onChange({ ...value, [field]: fieldValue });
  }

  function toggleChannel(channel: ContactChannel) {
    const exists = value.preferredChannels.includes(channel);
    const nextChannels = exists
      ? value.preferredChannels.filter((item) => item !== channel)
      : [...value.preferredChannels, channel];

    updateField("preferredChannels", nextChannels);
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="contact-name" className="text-sm font-medium text-[color:var(--color-text)]">
            Nome completo
          </label>
          <input
            id="contact-name"
            value={value.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Maria Oliveira"
          />
          {errors?.name && <p className="text-xs text-[color:var(--color-danger)]">{errors.name}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="contact-role" className="text-sm font-medium text-[color:var(--color-text)]">
            Cargo
          </label>
          <input
            id="contact-role"
            value={value.role}
            onChange={(event) => updateField("role", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Diretora comercial"
          />
          {errors?.role && <p className="text-xs text-[color:var(--color-danger)]">{errors.role}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="contact-department" className="text-sm font-medium text-[color:var(--color-text)]">
            Departamento (opcional)
          </label>
          <input
            id="contact-department"
            value={value.department}
            onChange={(event) => updateField("department", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="Negócios"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="contact-email" className="text-sm font-medium text-[color:var(--color-text)]">
            E-mail
          </label>
          <input
            id="contact-email"
            value={value.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="contato@empresa.com"
            type="email"
          />
          {errors?.email && <p className="text-xs text-[color:var(--color-danger)]">{errors.email}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="contact-phone" className="text-sm font-medium text-[color:var(--color-text)]">
            Telefone
          </label>
          <input
            id="contact-phone"
            value={value.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="(11) 2345-6789"
          />
          {errors?.phone && <p className="text-xs text-[color:var(--color-danger)]">{errors.phone}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="contact-mobile" className="text-sm font-medium text-[color:var(--color-text)]">
            Celular (opcional)
          </label>
          <input
            id="contact-mobile"
            value={value.mobile}
            onChange={(event) => updateField("mobile", event.target.value)}
            className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
            placeholder="(11) 98765-4321"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium text-[color:var(--color-text)]">
          Canais preferenciais
        </span>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CHANNEL_LABELS) as ContactChannel[]).map((channel) => {
            const active = value.preferredChannels.includes(channel);
            return (
              <button
                key={channel}
                type="button"
                onClick={() => toggleChannel(channel)}
                className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                  active
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]"
                    : "border-[color:var(--color-border)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                }`}
              >
                {CHANNEL_LABELS[channel]}
              </button>
            );
          })}
        </div>
        {errors?.preferredChannels && (
          <p className="text-xs text-[color:var(--color-danger)]">{errors.preferredChannels}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-start gap-2 text-sm text-[color:var(--color-text)]">
          <input
            type="checkbox"
            checked={value.isPrimary}
            onChange={(event) => updateField("isPrimary", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
          />
          <span>
            Contato principal
            <p className="text-xs font-normal text-[color:var(--color-text-muted)]">
              Será destacado como principal para este cliente.
            </p>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm text-[color:var(--color-text)]">
          <input
            type="checkbox"
            checked={value.receiveNotifications}
            onChange={(event) => updateField("receiveNotifications", event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[color:var(--color-border)] text-[color:var(--color-primary)] focus:ring-[color:var(--color-primary)]"
          />
          <span>
            Receber notificações
            <p className="text-xs font-normal text-[color:var(--color-text-muted)]">
              Inclui este contato em alertas e comunicados automáticos.
            </p>
          </span>
        </label>
      </div>

      <div className="space-y-1">
        <label htmlFor="contact-notes" className="text-sm font-medium text-[color:var(--color-text)]">
          Observações (opcional)
        </label>
        <textarea
          id="contact-notes"
          value={value.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          className="h-24 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
          placeholder="Responsável pelo comitê executivo."
        />
      </div>

      {errors?.form && <p className="text-sm text-[color:var(--color-danger)]">{errors.form}</p>}

      <div className="flex flex-wrap justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
