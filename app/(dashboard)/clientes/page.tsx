"use client";

import { useMemo, useState } from "react";

import { ContactList } from "@/app/components/ContactList";
import { ContactDraft } from "@/app/components/ContactForm";
import { Drawer } from "@/app/components/Drawer";
import { EmptyState } from "@/app/components/EmptyState";
import { NewClientModal } from "@/app/components/NewClientModal";
import { PageHeader } from "@/app/components/PageHeader";
import { SkeletonList } from "@/app/components/skeletons/SkeletonList";
import { SkeletonTable } from "@/app/components/skeletons/SkeletonTable";
import { Toast } from "@/app/components/Toast";
import {
  ClientDataProvider,
  type CreateClientWithContactsPayload,
  useClientData,
} from "@/app/components/providers/ClientDataProvider";
import type { Client, ContactChannel } from "@/app/types/client";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDocument(client: Client) {
  const digits = client.document.slice(0, client.type === "PF" ? 11 : 14);

  if (client.type === "PF") {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function preferencesToArray(preferences: Record<ContactChannel, boolean>) {
  return (Object.keys(preferences) as ContactChannel[]).filter(
    (channel) => preferences[channel],
  );
}

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

function ClientesPageContent() {
  const { clientsWithRelations, createClient } = useClientData();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const selectedClient = useMemo(() => {
    if (!selectedClientId) {
      return null;
    }

    return clientsWithRelations.find(
      (relation) => relation.client.id === selectedClientId,
    ) ?? null;
  }, [clientsWithRelations, selectedClientId]);

  function handleSubmit(payload: CreateClientWithContactsPayload) {
    createClient(payload);
    setToast({ message: "Cliente cadastrado com sucesso.", type: "success" });
    return true;
  }

  function openDrawer(clientId: string) {
    setSelectedClientId(clientId);
  }

  function closeDrawer() {
    setSelectedClientId(null);
  }

  const totalClientes = clientsWithRelations.length;

  const drawerContacts: ContactDraft[] = useMemo(() => {
    if (!selectedClient) {
      return [];
    }

    return selectedClient.contacts.map(({ contact, link }) => ({
      id: contact.id,
      name: contact.name,
      role: contact.role,
      department: contact.department ?? "",
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile ?? "",
      preferredChannels: preferencesToArray(contact.preferredChannels),
      notes: contact.notes ?? "",
      isPrimary: link.isPrimary,
      receiveNotifications: link.receiveNotifications,
    }));
  }, [selectedClient]);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Acompanhe os clientes cadastrados, visualize dados completos e adicione novos registros pelo assistente."
        actions={
          <>
            <button className="rounded-full border border-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-[var(--color-accent)] transition hover:border-[var(--color-accent-dark)] hover:text-[var(--color-accent-dark)]">
              Importar
            </button>
            <button
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo cliente
            </button>
          </>
        }
      />

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] shadow-sm">
        <header className="flex flex-col gap-2 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Clientes cadastrados</h2>
            <p className="text-sm text-[var(--color-text-muted)]">
              Dados persistidos na store local com vínculos de contatos e endereços.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-[var(--color-accent)]">
              Total {totalClientes}
            </span>
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[var(--color-text-muted)]">
              Contatos vinculados {clientsWithRelations.reduce(
                (total, relation) => total + relation.contacts.length,
                0,
              )}
            </span>
          </div>
        </header>
        <div className="divide-y divide-[var(--color-border)]">
          <div className="grid gap-4 bg-[var(--color-surface-alt)] px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] md:grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr]">
            <span>Cliente</span>
            <span>CPF/CNPJ</span>
            <span>Cidade</span>
            <span>Contato principal</span>
            <span className="text-right">Potencial</span>
          </div>
          {clientsWithRelations.map(({ client, contacts }) => {
            const primaryContact = contacts.find((item) => item.link.isPrimary);
            const city = client.addresses[0]?.city ?? "—";

            return (
              <button
                key={client.id}
                type="button"
                onClick={() => openDrawer(client.id)}
                className="grid w-full gap-4 px-5 py-4 text-left text-sm text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface-muted)] md:grid-cols-[2fr_1.2fr_1fr_1.5fr_1fr]"
              >
                <div>
                  <p className="font-medium text-[var(--color-text)]">
                    {client.name}
                  </p>
                  <p className="text-xs uppercase text-[var(--color-text-muted)]">
                    {client.type === "PJ" ? "Pessoa jurídica" : "Pessoa física"} • {client.segment}
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--color-text)]">
                  {formatDocument(client)}
                </span>
                <span>{city}</span>
                <div>
                  {primaryContact ? (
                    <>
                      <p className="font-medium text-[var(--color-text)]">
                        {primaryContact.contact.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {primaryContact.contact.email}
                      </p>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">—</span>
                  )}
                </div>
                <span className="text-right font-semibold text-[var(--color-text)]">
                  {formatCurrency(client.potentialValue)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Carregamento padrão</h2>
          <SkeletonTable rows={3} columns={5} />
          <SkeletonList items={4} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum cliente neste filtro"
            description="Aplique outro critério ou cadastre um cliente manualmente."
            actionLabel="Cadastrar cliente"
            onAction={() => setModalOpen(true)}
          />
        </div>
      </section>

      <NewClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Drawer
        open={selectedClient != null}
        onClose={closeDrawer}
        title={selectedClient?.client.name ?? ""}
        description={selectedClient ? `${selectedClient.client.segment} • ${selectedClient.client.stage}` : undefined}
      >
        {selectedClient && (
          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Dados do cliente</h3>
              <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
                <li>
                  <span className="font-semibold text-[var(--color-text)]">Tipo:</span> {selectedClient.client.type === "PJ" ? "Pessoa jurídica" : "Pessoa física"}
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text)]">Documento:</span> {formatDocument(selectedClient.client)}
                </li>
                <li>
                  <span className="font-semibold text-[var(--color-text)]">Potencial:</span> {formatCurrency(selectedClient.client.potentialValue)}
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Endereços</h3>
              <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                {selectedClient.client.addresses.map((address) => (
                  <li key={address.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                    <p className="font-medium text-[var(--color-text)]">{address.label}</p>
                    <p>
                      {address.street}, {address.number}
                      {address.complement ? ` - ${address.complement}` : ""}
                    </p>
                    <p>
                      {address.district} • {address.city}/{address.state}
                    </p>
                    <p>CEP {address.zipCode}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Preferências de contato</h3>
              <div className="flex flex-wrap gap-2">
                {preferencesToArray(selectedClient.client.contactPreferences).map((channel) => (
                  <span
                    key={channel}
                    className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"
                  >
                    {channel === "email"
                      ? "E-mail"
                      : channel === "phone"
                      ? "Telefone"
                      : channel === "sms"
                      ? "SMS"
                      : "WhatsApp"}
                  </span>
                ))}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-[var(--color-text)]">Contatos</h3>
              <ContactList contacts={drawerContacts} readOnly />
            </section>
          </div>
        )}
      </Drawer>
    </>
  );
}

export default function ClientesPage() {
  return (
    <ClientDataProvider>
      <ClientesPageContent />
    </ClientDataProvider>
  );
}
