"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  clienteContatoMock,
  clientesMock,
  contatosMock,
} from "@/app/(dashboard)/_mocks/data";
import {
  type Client,
  type ClientContact,
  type Contact,
} from "@/app/types/client";
import { generateId } from "@/app/utils/id";

export type ClientWithRelations = {
  client: Client;
  contacts: Array<{ contact: Contact; link: ClientContact }>;
};

type ContactLinkPayload = {
  contact: Omit<Contact, "id" | "createdAt" | "updatedAt"> & { id?: string };
  link: Pick<ClientContact, "isPrimary" | "receiveNotifications">;
};

export type CreateClientWithContactsPayload = {
  client: Omit<Client, "id" | "createdAt" | "updatedAt">;
  contacts: ContactLinkPayload[];
};

interface ClientDataContextValue {
  clients: Client[];
  contacts: Contact[];
  clientContacts: ClientContact[];
  clientsWithRelations: ClientWithRelations[];
  createClient: (payload: CreateClientWithContactsPayload) => ClientWithRelations;
}

const ClientDataContext = createContext<ClientDataContextValue | undefined>(
  undefined,
);

function buildClientRelations(
  clients: Client[],
  contacts: Contact[],
  clientContacts: ClientContact[],
): ClientWithRelations[] {
  return clients.map((client) => {
    const links = clientContacts.filter((link) => link.clientId === client.id);

    const relatedContacts = links
      .map((link) => {
        const contact = contacts.find((item) => item.id === link.contactId);
        if (!contact) {
          return null;
        }

        return { contact, link };
      })
      .filter((relation): relation is { contact: Contact; link: ClientContact } =>
        relation !== null,
      );

    return {
      client,
      contacts: relatedContacts,
    };
  });
}

export function ClientDataProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>(clientesMock);
  const [contacts, setContacts] = useState<Contact[]>(contatosMock);
  const [clientContacts, setClientContacts] = useState<ClientContact[]>(
    clienteContatoMock,
  );

  const clientsWithRelations = useMemo(
    () => buildClientRelations(clients, contacts, clientContacts),
    [clients, contacts, clientContacts],
  );

  function createClient(
    payload: CreateClientWithContactsPayload,
  ): ClientWithRelations {
    const now = new Date().toISOString();
    const clientId = generateId("cli");

    const newClient: Client = {
      ...payload.client,
      id: clientId,
      createdAt: now,
      updatedAt: now,
    };

    const linksToInsert: ClientContact[] = [];
    const relationsForClient: Array<{ contact: Contact; link: ClientContact }> = [];

    setContacts((previous) => {
      const updated = [...previous];

      payload.contacts.forEach(({ contact, link }) => {
        const resolvedContactId = contact.id ?? generateId("ctt");
        const existingIndex = updated.findIndex(
          (item) => item.id === resolvedContactId,
        );

        let contactRecord: Contact;
        if (existingIndex >= 0) {
          const existing = updated[existingIndex];
          contactRecord = {
            ...existing,
            ...contact,
            id: resolvedContactId,
            createdAt: existing.createdAt,
            updatedAt: now,
          };
          updated[existingIndex] = contactRecord;
        } else {
          contactRecord = {
            ...contact,
            id: resolvedContactId,
            createdAt: now,
            updatedAt: now,
          };
          updated.push(contactRecord);
        }

        const linkRecord: ClientContact = {
          id: generateId("link"),
          clientId,
          contactId: resolvedContactId,
          isPrimary: link.isPrimary,
          receiveNotifications: link.receiveNotifications,
          createdAt: now,
          updatedAt: now,
        };

        linksToInsert.push(linkRecord);
        relationsForClient.push({ contact: contactRecord, link: linkRecord });
      });

      return updated;
    });

    setClientContacts((previous) => [...linksToInsert, ...previous]);
    setClients((previous) => [newClient, ...previous]);

    return {
      client: newClient,
      contacts: relationsForClient,
    };
  }

  const value = useMemo<ClientDataContextValue>(
    () => ({
      clients,
      contacts,
      clientContacts,
      clientsWithRelations,
      createClient,
    }),
    [clients, contacts, clientContacts, clientsWithRelations],
  );

  return (
    <ClientDataContext.Provider value={value}>
      {children}
    </ClientDataContext.Provider>
  );
}

export function useClientData() {
  const context = useContext(ClientDataContext);

  if (!context) {
    throw new Error("useClientData must be used within a ClientDataProvider");
  }

  return context;
}
