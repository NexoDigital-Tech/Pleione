"use client";

import { useMemo, useState } from "react";

import { ContactForm, type ContactDraft } from "./ContactForm";
import { ContactList } from "./ContactList";
import { Dialog } from "./Dialog";
import type { CreateClientWithContactsPayload } from "./providers/ClientDataProvider";
import type { ClientType, ContactChannel } from "@/app/types/client";
import { generateId } from "@/app/utils/id";

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateClientWithContactsPayload) => boolean | void;
}

type GeneralDataState = {
  clientType: ClientType;
  fullName: string;
  companyName: string;
  tradeName: string;
  document: string;
  segment: string;
  stage: string;
  potentialValue: string;
  birthDate: string;
  foundationDate: string;
  contactPreferences: ContactChannel[];
  notes: string;
};

type AddressState = {
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  country: string;
};

type GeneralErrors = Partial<
  Record<
    | "fullName"
    | "companyName"
    | "tradeName"
    | "document"
    | "segment"
    | "stage"
    | "potentialValue"
    | "contactPreferences",
    string
  >
>;

type AddressErrors = Partial<
  Record<"zipCode" | "street" | "number" | "district" | "city" | "state", string>
>;

const steps = [
  {
    title: "Dados gerais",
    description: "Informe o tipo de cliente, documento e potencial do negócio.",
  },
  {
    title: "Endereço",
    description: "Cadastre o endereço principal e dados de localização.",
  },
  {
    title: "Contatos",
    description: "Registre os contatos vinculados a este cliente.",
  },
];

const emptyContactDraft = (isFirst: boolean): ContactDraft => ({
  name: "",
  role: "",
  department: "",
  email: "",
  phone: "",
  mobile: "",
  preferredChannels: ["email"],
  notes: "",
  isPrimary: isFirst,
  receiveNotifications: true,
});

export function NewClientModal({ open, onClose, onSubmit }: NewClientModalProps) {
  const [step, setStep] = useState(0);
  const [generalData, setGeneralData] = useState<GeneralDataState>({
    clientType: "PJ",
    fullName: "",
    companyName: "",
    tradeName: "",
    document: "",
    segment: "",
    stage: "",
    potentialValue: "",
    birthDate: "",
    foundationDate: "",
    contactPreferences: ["email"],
    notes: "",
  });
  const [address, setAddress] = useState<AddressState>({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    country: "Brasil",
  });
  const [contacts, setContacts] = useState<ContactDraft[]>([]);
  const [contactFormValue, setContactFormValue] = useState<ContactDraft>(
    emptyContactDraft(true),
  );
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const [generalErrors, setGeneralErrors] = useState<GeneralErrors>({});
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});
  const [contactFormErrors, setContactFormErrors] = useState<
    Partial<Record<keyof ContactDraft | "form", string>>
  >({});
  const [contactsError, setContactsError] = useState(" ");

  const documentPlaceholder =
    generalData.clientType === "PF" ? "000.000.000-00" : "00.000.000/0000-00";

  function resetWizard() {
    setStep(0);
    setGeneralData({
      clientType: "PJ",
      fullName: "",
      companyName: "",
      tradeName: "",
      document: "",
      segment: "",
      stage: "",
      potentialValue: "",
      birthDate: "",
      foundationDate: "",
      contactPreferences: ["email"],
      notes: "",
    });
    setAddress({
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      country: "Brasil",
    });
    setContacts([]);
    setContactFormValue(emptyContactDraft(true));
    setEditingContactId(null);
    setGeneralErrors({});
    setAddressErrors({});
    setContactFormErrors({});
    setContactsError(" ");
  }

  function closeAndReset() {
    resetWizard();
    onClose();
  }

  function handleGeneralChange<K extends keyof GeneralDataState>(
    field: K,
    value: GeneralDataState[K],
  ) {
    setGeneralData((previous) => ({ ...previous, [field]: value }));
  }

  function handleAddressChange<K extends keyof AddressState>(
    field: K,
    value: AddressState[K],
  ) {
    setAddress((previous) => ({ ...previous, [field]: value }));
  }

  function formatDocument(input: string): string {
    const digits = input.replace(/\D/g, "");

    if (generalData.clientType === "PF") {
      return digits
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    return digits
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }

  function handleDocumentChange(value: string) {
    const formatted = formatDocument(value);
    handleGeneralChange("document", formatted);
  }

  function validateGeneralStep(): boolean {
    const errors: GeneralErrors = {};

    if (generalData.clientType === "PF") {
      if (!generalData.fullName.trim()) {
        errors.fullName = "Informe o nome completo.";
      }
    } else {
      if (!generalData.companyName.trim()) {
        errors.companyName = "Informe a razão social.";
      }
      if (!generalData.tradeName.trim()) {
        errors.tradeName = "Informe o nome fantasia.";
      }
    }

    const digits = generalData.document.replace(/\D/g, "");
    if (generalData.clientType === "PF" && digits.length !== 11) {
      errors.document = "Informe um CPF válido.";
    }
    if (generalData.clientType === "PJ" && digits.length !== 14) {
      errors.document = "Informe um CNPJ válido.";
    }

    if (!generalData.segment.trim()) {
      errors.segment = "Informe o segmento.";
    }
    if (!generalData.stage.trim()) {
      errors.stage = "Informe a fase do relacionamento.";
    }
    if (!generalData.potentialValue.trim()) {
      errors.potentialValue = "Informe o valor potencial.";
    }
    if (generalData.contactPreferences.length === 0) {
      errors.contactPreferences = "Selecione ao menos um canal preferencial.";
    }

    setGeneralErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateAddressStep(): boolean {
    const errors: AddressErrors = {};

    if (!address.zipCode.trim()) {
      errors.zipCode = "Informe o CEP.";
    }
    if (!address.street.trim()) {
      errors.street = "Informe o logradouro.";
    }
    if (!address.number.trim()) {
      errors.number = "Informe o número.";
    }
    if (!address.district.trim()) {
      errors.district = "Informe o bairro.";
    }
    if (!address.city.trim()) {
      errors.city = "Informe a cidade.";
    }
    if (!address.state.trim()) {
      errors.state = "Informe o estado.";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateContactsStep(): boolean {
    const hasPrimary = contacts.some((contact) => contact.isPrimary);
    const isValid = contacts.length > 0 && hasPrimary;
    setContactsError(
      isValid
        ? " "
        : contacts.length === 0
        ? "Cadastre pelo menos um contato para continuar."
        : "Defina um contato principal para este cliente.",
    );
    return isValid;
  }

  function handleNext() {
    const validators = [validateGeneralStep, validateAddressStep, validateContactsStep];

    if (validators[step]()) {
      if (step < steps.length - 1) {
        setStep((previous) => previous + 1);
      } else {
        handleSubmit();
      }
    }
  }

  function handlePrevious() {
    if (step === 0) {
      return;
    }

    setStep((previous) => previous - 1);
  }

  function handleContactSubmit() {
    const errors: Partial<Record<keyof ContactDraft | "form", string>> = {};

    if (!contactFormValue.name.trim()) {
      errors.name = "Informe o nome do contato.";
    }
    if (!contactFormValue.role.trim()) {
      errors.role = "Informe o cargo.";
    }
    if (!contactFormValue.email.trim()) {
      errors.email = "Informe o e-mail.";
    }
    if (!contactFormValue.phone.trim()) {
      errors.phone = "Informe o telefone.";
    }
    if (contactFormValue.preferredChannels.length === 0) {
      errors.preferredChannels = "Escolha pelo menos um canal.";
    }

    if (Object.keys(errors).length > 0) {
      setContactFormErrors(errors);
      return;
    }

    setContactFormErrors({});

    const contactId = editingContactId ?? generateId("tmp-contact");
    const newContact: ContactDraft = { ...contactFormValue, id: contactId };

    setContacts((previous) => {
      let updated = editingContactId
        ? previous.map((contact) =>
            contact.id === editingContactId ? { ...newContact } : contact,
          )
        : [...previous, newContact];

      if (newContact.isPrimary) {
        updated = updated.map((contact) => ({
          ...contact,
          isPrimary: contact.id === contactId,
        }));
      } else if (!updated.some((contact) => contact.isPrimary) && updated.length > 0) {
        updated[0] = { ...updated[0], isPrimary: true };
      }

      return updated;
    });

    setContactsError(" ");
    setContactFormValue(emptyContactDraft(false));
    setEditingContactId(null);
  }

  function handleEditContact(id: string) {
    const existing = contacts.find((contact) => contact.id === id);
    if (!existing) {
      return;
    }

    setEditingContactId(id);
    setContactFormValue({ ...existing });
  }

  function handleRemoveContact(id: string) {
    setContacts((previous) => {
      const filtered = previous.filter((contact) => contact.id !== id);

      if (!filtered.some((contact) => contact.isPrimary) && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isPrimary: true };
      }

      return filtered;
    });

    const nextIsFirst = contacts.length <= 1;

    if (editingContactId === id) {
      setEditingContactId(null);
      setContactFormErrors({});
      setContactFormValue(emptyContactDraft(nextIsFirst));
    } else if (nextIsFirst) {
      setContactFormValue(emptyContactDraft(true));
    }

    setContactsError(" ");
  }

  function handleTogglePrimary(id: string) {
    setContacts((previous) =>
      previous.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      })),
    );
  }

  function handleToggleNotifications(id: string) {
    setContacts((previous) =>
      previous.map((contact) =>
        contact.id === id
          ? { ...contact, receiveNotifications: !contact.receiveNotifications }
          : contact,
      ),
    );
  }

  function buildContactPreferences(preferences: ContactChannel[]) {
    return {
      email: preferences.includes("email"),
      phone: preferences.includes("phone"),
      sms: preferences.includes("sms"),
      whatsapp: preferences.includes("whatsapp"),
    };
  }

  const formattedContacts = useMemo(() => contacts, [contacts]);

  function handleSubmit() {
    const payload: CreateClientWithContactsPayload = {
      client: {
        type: generalData.clientType,
        name:
          generalData.clientType === "PF"
            ? generalData.fullName.trim()
            : generalData.companyName.trim(),
        document: generalData.document.replace(/\D/g, ""),
        segment: generalData.segment.trim(),
        stage: generalData.stage.trim(),
        potentialValue: Number(generalData.potentialValue),
        addresses: [
          {
            id: generateId("addr"),
            label: "Principal",
            street: address.street.trim(),
            number: address.number.trim(),
            complement: address.complement.trim() || undefined,
            district: address.district.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
            zipCode: address.zipCode.replace(/\D/g, ""),
            country: address.country.trim(),
          },
        ],
        contactPreferences: buildContactPreferences(generalData.contactPreferences),
        personDetails:
          generalData.clientType === "PF"
            ? {
                birthDate: generalData.birthDate || undefined,
              }
            : undefined,
        companyDetails:
          generalData.clientType === "PJ"
            ? {
                tradeName: generalData.tradeName || undefined,
                foundationDate: generalData.foundationDate || undefined,
              }
            : undefined,
        notes: generalData.notes.trim() || undefined,
      },
      contacts: formattedContacts.map((contact) => ({
        contact: {
          name: contact.name.trim(),
          role: contact.role.trim(),
          department: contact.department.trim() || undefined,
          email: contact.email.trim(),
          phone: contact.phone.trim(),
          mobile: contact.mobile.trim() || undefined,
          preferredChannels: buildContactPreferences(contact.preferredChannels),
          notes: contact.notes.trim() || undefined,
        },
        link: {
          isPrimary: contact.isPrimary,
          receiveNotifications: contact.receiveNotifications,
        },
      })),
    };

    const result = onSubmit(payload);

    if (result !== false) {
      closeAndReset();
    }
  }

  return (
    <Dialog
      open={open}
      onClose={closeAndReset}
      title="Novo cliente"
      description="Utilize o assistente para cadastrar um cliente com endereço e contatos."
      footer={
        <div className="flex flex-wrap justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
            {steps.map((item, index) => (
              <span
                key={item.title}
                className={`flex items-center gap-2 ${
                  index === step
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                    index === step
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-border)]"
                  }`}
                >
                  {index + 1}
                </span>
                {item.title}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={step === 0}
              className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition hover:text-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
            >
              {step === steps.length - 1 ? "Salvar cliente" : "Avançar"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <header className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {steps[step].title}
          </h3>
          <p className="text-sm text-[var(--color-text-muted)]">
            {steps[step].description}
          </p>
        </header>

        {step === 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {["PJ", "PF"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleGeneralChange("clientType", type as ClientType)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    generalData.clientType === type
                      ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                      : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {type === "PJ" ? "Pessoa Jurídica" : "Pessoa Física"}
                </button>
              ))}
            </div>

            {generalData.clientType === "PF" ? (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-full-name">
                  Nome completo
                </label>
                <input
                  id="client-full-name"
                  value={generalData.fullName}
                  onChange={(event) => handleGeneralChange("fullName", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Nome completo"
                />
                {generalErrors.fullName && (
                  <p className="text-xs text-[var(--color-danger)]">{generalErrors.fullName}</p>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-company-name">
                    Razão social
                  </label>
                  <input
                    id="client-company-name"
                    value={generalData.companyName}
                    onChange={(event) => handleGeneralChange("companyName", event.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder="Nome da empresa"
                  />
                  {generalErrors.companyName && (
                    <p className="text-xs text-[var(--color-danger)]">{generalErrors.companyName}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-trade-name">
                    Nome fantasia
                  </label>
                  <input
                    id="client-trade-name"
                    value={generalData.tradeName}
                    onChange={(event) => handleGeneralChange("tradeName", event.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    placeholder="Nome fantasia"
                  />
                  {generalErrors.tradeName && (
                    <p className="text-xs text-[var(--color-danger)]">{generalErrors.tradeName}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-document">
                  {generalData.clientType === "PF" ? "CPF" : "CNPJ"}
                </label>
                <input
                  id="client-document"
                  value={generalData.document}
                  onChange={(event) => handleDocumentChange(event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder={documentPlaceholder}
                />
                {generalErrors.document && (
                  <p className="text-xs text-[var(--color-danger)]">{generalErrors.document}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-potential">
                  Valor potencial (R$)
                </label>
                <input
                  id="client-potential"
                  type="number"
                  value={generalData.potentialValue}
                  onChange={(event) => handleGeneralChange("potentialValue", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="1500000"
                />
                {generalErrors.potentialValue && (
                  <p className="text-xs text-[var(--color-danger)]">{generalErrors.potentialValue}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-segment">
                  Segmento
                </label>
                <input
                  id="client-segment"
                  value={generalData.segment}
                  onChange={(event) => handleGeneralChange("segment", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Incorporação"
                />
                {generalErrors.segment && (
                  <p className="text-xs text-[var(--color-danger)]">{generalErrors.segment}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-stage">
                  Fase do relacionamento
                </label>
                <input
                  id="client-stage"
                  value={generalData.stage}
                  onChange={(event) => handleGeneralChange("stage", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Negociação"
                />
                {generalErrors.stage && (
                  <p className="text-xs text-[var(--color-danger)]">{generalErrors.stage}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {generalData.clientType === "PF" ? (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-birth-date">
                    Data de nascimento (opcional)
                  </label>
                  <input
                    id="client-birth-date"
                    type="date"
                    value={generalData.birthDate}
                    onChange={(event) => handleGeneralChange("birthDate", event.target.value)}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-foundation-date">
                      Data de fundação (opcional)
                    </label>
                    <input
                      id="client-foundation-date"
                      type="date"
                      value={generalData.foundationDate}
                      onChange={(event) => handleGeneralChange("foundationDate", event.target.value)}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                    />
                  </div>
                  <div />
                </>
              )}
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">
                Preferências de contato
              </span>
              <div className="flex flex-wrap gap-2">
                {(["email", "phone", "sms", "whatsapp"] as ContactChannel[]).map((channel) => {
                  const active = generalData.contactPreferences.includes(channel);
                  return (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => {
                        handleGeneralChange(
                          "contactPreferences",
                          active
                            ? generalData.contactPreferences.filter((item) => item !== channel)
                            : [...generalData.contactPreferences, channel],
                        );
                      }}
                      className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
                        active
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                          : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      {channel === "email"
                        ? "E-mail"
                        : channel === "phone"
                        ? "Telefone"
                        : channel === "sms"
                        ? "SMS"
                        : "WhatsApp"}
                    </button>
                  );
                })}
              </div>
              {generalErrors.contactPreferences && (
                <p className="text-xs text-[var(--color-danger)]">
                  {generalErrors.contactPreferences}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-notes">
                Observações internas (opcional)
              </label>
              <textarea
                id="client-notes"
                value={generalData.notes}
                onChange={(event) => handleGeneralChange("notes", event.target.value)}
                className="h-24 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                placeholder="Detalhes adicionais sobre o cliente."
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1 space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-zip">
                  CEP
                </label>
                <input
                  id="client-zip"
                  value={address.zipCode}
                  onChange={(event) => handleAddressChange("zipCode", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="00000-000"
                />
                {addressErrors.zipCode && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.zipCode}</p>
                )}
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-street">
                  Logradouro
                </label>
                <input
                  id="client-street"
                  value={address.street}
                  onChange={(event) => handleAddressChange("street", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Rua, avenida..."
                />
                {addressErrors.street && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.street}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-number">
                  Número
                </label>
                <input
                  id="client-number"
                  value={address.number}
                  onChange={(event) => handleAddressChange("number", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="123"
                />
                {addressErrors.number && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.number}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-complement">
                  Complemento (opcional)
                </label>
                <input
                  id="client-complement"
                  value={address.complement}
                  onChange={(event) => handleAddressChange("complement", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Sala, bloco..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-district">
                  Bairro
                </label>
                <input
                  id="client-district"
                  value={address.district}
                  onChange={(event) => handleAddressChange("district", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Centro"
                />
                {addressErrors.district && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.district}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-city">
                  Cidade
                </label>
                <input
                  id="client-city"
                  value={address.city}
                  onChange={(event) => handleAddressChange("city", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="São Paulo"
                />
                {addressErrors.city && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.city}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-state">
                  Estado
                </label>
                <input
                  id="client-state"
                  value={address.state}
                  onChange={(event) => handleAddressChange("state", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="SP"
                />
                {addressErrors.state && (
                  <p className="text-xs text-[var(--color-danger)]">{addressErrors.state}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--color-text)]" htmlFor="client-country">
                  País
                </label>
                <input
                  id="client-country"
                  value={address.country}
                  onChange={(event) => handleAddressChange("country", event.target.value)}
                  className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                  placeholder="Brasil"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <ContactForm
              value={contactFormValue}
              onChange={setContactFormValue}
              onSubmit={handleContactSubmit}
              onCancel={editingContactId ? () => {
                setEditingContactId(null);
                setContactFormValue(emptyContactDraft(contacts.length === 0));
                setContactFormErrors({});
              } : undefined}
              submitLabel={editingContactId ? "Salvar contato" : "Adicionar contato"}
              errors={contactFormErrors}
            />

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-text)]">
                Contatos adicionados
              </h4>
              <p className="text-xs text-[var(--color-text-muted)]">
                Defina o contato principal e quem receberá notificações automáticas.
              </p>
              <div className="mt-3">
                <ContactList
                  contacts={formattedContacts}
                  onEdit={handleEditContact}
                  onRemove={handleRemoveContact}
                  onTogglePrimary={handleTogglePrimary}
                  onToggleNotifications={handleToggleNotifications}
                />
              </div>
              {contactsError.trim() && (
                <p className="mt-2 text-sm text-[var(--color-danger)]">{contactsError}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
