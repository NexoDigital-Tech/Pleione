"use client";

import { ContactDraft } from "./ContactForm";

const CHANNEL_LABELS: Record<string, string> = {
  email: "E-mail",
  phone: "Telefone",
  sms: "SMS",
  whatsapp: "WhatsApp",
};

interface ContactListProps {
  contacts: ContactDraft[];
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onTogglePrimary?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
  readOnly?: boolean;
}

export function ContactList({
  contacts,
  onEdit,
  onRemove,
  onTogglePrimary,
  onToggleNotifications,
  readOnly = false,
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-text-muted)]">
        Nenhum contato adicionado.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {contacts.map((contact) => {
        const contactId = contact.id ?? contact.email;
        return (
          <li
            key={contactId}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {contact.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {contact.role}
                  {contact.department ? ` • ${contact.department}` : ""}
                </p>
                <div className="mt-2 space-y-1 text-xs text-[var(--color-text-muted)]">
                  <p>{contact.email}</p>
                  {contact.phone && <p>Fixo: {contact.phone}</p>}
                  {contact.mobile && <p>Celular: {contact.mobile}</p>}
                </div>
              </div>
              {!readOnly && onEdit && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(contactId)}
                    className="rounded-full border border-[var(--color-border)] px-4 py-1 text-xs font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                  >
                    Editar
                  </button>
                  {onRemove && (
                    <button
                      type="button"
                      onClick={() => onRemove(contactId)}
                      className="rounded-full border border-[var(--color-danger)] px-4 py-1 text-xs font-semibold text-[var(--color-danger)] transition hover:bg-[var(--color-danger)] hover:text-white"
                    >
                      Remover
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {contact.preferredChannels.map((channel) => (
                <span
                  key={`${contactId}-${channel}`}
                  className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 font-semibold text-[var(--color-primary)]"
                >
                  {CHANNEL_LABELS[channel] ?? channel}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
              <span
                className={`rounded-full px-3 py-1 font-semibold ${
                  contact.isPrimary
                    ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                    : "bg-[var(--color-surface-muted)]"
                }`}
              >
                {contact.isPrimary ? "Contato principal" : "Secundário"}
              </span>
              <span
                className={`rounded-full px-3 py-1 font-semibold ${
                  contact.receiveNotifications
                    ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    : "bg-[var(--color-surface-muted)]"
                }`}
              >
                {contact.receiveNotifications
                  ? "Recebe notificações"
                  : "Sem notificações"}
              </span>
            </div>

            {!readOnly && (
              <div className="mt-4 flex flex-wrap gap-3 text-xs">
                {onTogglePrimary && (
                  <button
                    type="button"
                    onClick={() => onTogglePrimary(contactId)}
                    className="rounded-full border border-[var(--color-border)] px-4 py-1 font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                  >
                    {contact.isPrimary ? "Remover como principal" : "Definir como principal"}
                  </button>
                )}
                {onToggleNotifications && (
                  <button
                    type="button"
                    onClick={() => onToggleNotifications(contactId)}
                    className="rounded-full border border-[var(--color-border)] px-4 py-1 font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
                  >
                    {contact.receiveNotifications
                      ? "Desativar notificações"
                      : "Ativar notificações"}
                  </button>
                )}
              </div>
            )}

            {contact.notes && (
              <p className="mt-4 text-xs text-[var(--color-text-muted)]">
                {contact.notes}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
