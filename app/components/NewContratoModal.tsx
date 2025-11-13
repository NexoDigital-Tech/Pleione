"use client";

import { useEffect, useMemo, useState, useTransition } from "react";

import {
  contractSelectableOptions,
  contractTeamDirectory,
  type Contract,
  type ContractBilling,
  type ContractDocConfig,
  type ContractSignature,
  type ContractStatus,
  type ContractTeam,
  type ContractTerms,
} from "../(dashboard)/contratos/data";
import { useContractsStore } from "../(dashboard)/contratos/store";
import { ContractBillingForm } from "./ContractBillingForm";
import { ContractDocConfigForm } from "./ContractDocConfigForm";
import { ContractTeamSelector } from "./ContractTeamSelector";
import { ContractTermsForm } from "./ContractTermsForm";
import { Drawer } from "./Drawer";

export type ContratoPayload = {
  id: string;
  codigo: string;
  cliente: string;
  vigencia: string;
  status: string;
  valorTotal?: number;
};

const steps = [
  { id: "basic", label: "Dados básicos" },
  { id: "doc", label: "Template e documento" },
  { id: "terms", label: "Termos e garantias" },
  { id: "billing", label: "Faturamento" },
  { id: "team", label: "Equipe" },
] as const;

type StepId = (typeof steps)[number]["id"];

export type ContractModalStep = StepId;

type ContractFormState = {
  code: string;
  status: ContractStatus;
  clientName: string;
  enterpriseName: string;
  proposalCode: string;
  signature: ContractSignature;
  financialSummary: Contract["financialSummary"];
  docConfig: ContractDocConfig;
  terms: ContractTerms;
  billing: ContractBilling;
  team: ContractTeam;
  highlights: string[];
};

interface NewContratoModalProps {
  open: boolean;
  onClose: () => void;
  contractId?: string;
  initialStep?: StepId;
  onCompleted?: (contract: Contract, mode: "create" | "edit") => void;
}

const today = () => new Date();

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(base: Date, days: number) {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function addYears(base: Date, years: number) {
  const copy = new Date(base);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

function toDateTimeLocal(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) {
    return value;
  }

  const date = new Date(value);
  return date.toISOString();
}

function createDefaultFormState(): ContractFormState {
  const defaultClient = contractSelectableOptions.clientes[0];
  const defaultEnterprise = contractSelectableOptions.empreendimentos[0];
  const defaultProposal = contractSelectableOptions.propostas[0];
  const defaultOwner =
    contractTeamDirectory.find((member) => member.type === "Interno") ?? contractTeamDirectory[0];
  const fallbackOwner =
    defaultOwner ??
    ({
      id: "internal-fallback",
      name: "Responsável Pleione",
      role: "Gerente de Contas",
      email: "responsavel@pleione.com",
      company: "Pleione",
      type: "Interno" as const,
    } satisfies ContractTeam["owner"]);

  const now = today();
  const defaultTeam: ContractTeam = {
    mode: "Híbrido",
    owner: fallbackOwner,
    members: [fallbackOwner],
    communicationChannel: "Canal dedicado no Teams",
  };

  const defaultDocConfig: ContractDocConfig = {
    templateId: "",
    templateName: "",
    version: "v1.0",
    signaturePlatform: "Clicksign",
    requiresWitness: false,
    sendForLegalReview: true,
    autoReminders: true,
    lastUpdated: formatDate(now),
    attachmentUrls: [],
  };

  const defaultTerms: ContractTerms = {
    startDate: formatDate(now),
    endDate: formatDate(addYears(now, 1)),
    renewal: "Automática",
    responsibilities: [],
    guarantees: [],
    keyClauses: [],
    noticePeriodDays: 30,
  };

  const defaultBilling: ContractBilling = {
    totalValue: 0,
    currency: "BRL",
    billingCycle: "Mensal",
    taxes: [],
    paymentConditions: [],
    discountPolicy: "",
  };

  const defaultSignature: ContractSignature = {
    status: "Pendente",
    pendingSigners: defaultClient ? [defaultClient.contatoPrincipal.nome] : [],
    lastSentAt: now.toISOString(),
    deadline: formatDate(addDays(now, 7)),
  };

  return {
    code: "",
    status: "Rascunho",
    clientName: defaultClient?.nome ?? "",
    enterpriseName: defaultEnterprise?.nome ?? "",
    proposalCode: defaultProposal?.codigo ?? "",
    signature: defaultSignature,
    financialSummary: {
      totalValue: defaultBilling.totalValue,
      executedPercentage: 0,
      outstandingAmount: defaultBilling.totalValue,
      nextInvoiceDate: formatDate(now),
    },
    docConfig: defaultDocConfig,
    terms: defaultTerms,
    billing: defaultBilling,
    team: defaultTeam,
    highlights: [],
  };
}

function contractToFormState(contract: Contract): ContractFormState {
  return {
    code: contract.code,
    status: contract.status,
    clientName: contract.client.nome,
    enterpriseName: contract.enterprise.nome,
    proposalCode: contract.proposal.codigo,
    signature: {
      status: contract.signature.status,
      pendingSigners: [...contract.signature.pendingSigners],
      lastSentAt: contract.signature.lastSentAt,
      deadline: contract.signature.deadline,
    },
    financialSummary: { ...contract.financialSummary },
    docConfig: { ...contract.docConfig, attachmentUrls: [...contract.docConfig.attachmentUrls] },
    terms: {
      ...contract.terms,
      responsibilities: [...contract.terms.responsibilities],
      guarantees: [...contract.terms.guarantees],
      keyClauses: [...contract.terms.keyClauses],
    },
    billing: {
      ...contract.billing,
      taxes: contract.billing.taxes.map((tax) => ({ ...tax })),
      paymentConditions: [...contract.billing.paymentConditions],
    },
    team: {
      mode: contract.team.mode,
      owner: contract.team.owner,
      members: [...contract.team.members],
      communicationChannel: contract.team.communicationChannel,
    },
    highlights: [...contract.highlights],
  };
}

export function NewContratoModal({ open, onClose, contractId, initialStep, onCompleted }: NewContratoModalProps) {
  const { contracts, createContract, updateContract } = useContractsStore();
  const editingContract = useMemo(
    () => contracts.find((contract) => contract.id === contractId) ?? null,
    [contracts, contractId],
  );
  const [currentStep, setCurrentStep] = useState<StepId>(steps[0].id);
  const [formState, setFormState] = useState<ContractFormState>(createDefaultFormState);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      return;
    }

    startTransition(() => {
      setCurrentStep(initialStep ?? steps[0].id);
      setFormState(editingContract ? contractToFormState(editingContract) : createDefaultFormState());
      setError(null);
    });
  }, [open, editingContract, initialStep, startTransition]);

  function handleClose() {
    setError(null);
    onClose();
  }

  function updateForm(partial: Partial<ContractFormState>) {
    setFormState((previous) => ({ ...previous, ...partial }));
  }

  function handleBillingChange(billing: ContractBilling) {
    setFormState((previous) => {
      const executed = previous.financialSummary.executedPercentage;
      const totalValue = billing.totalValue;
      const outstandingAmount = Math.max(0, totalValue * (1 - executed));

      return {
        ...previous,
        billing,
        financialSummary: {
          ...previous.financialSummary,
          totalValue,
          outstandingAmount,
        },
      };
    });
  }

  function handleExecutedPercentageChange(percentage: number) {
    const safePercentage = Math.min(100, Math.max(0, percentage));
    const normalized = safePercentage / 100;

    setFormState((previous) => {
      const total = previous.billing.totalValue || previous.financialSummary.totalValue;
      const outstandingAmount = Math.max(0, total * (1 - normalized));

      return {
        ...previous,
        financialSummary: {
          ...previous.financialSummary,
          executedPercentage: normalized,
          outstandingAmount,
        },
      };
    });
  }

  function handleOutstandingAmountChange(amount: number) {
    setFormState((previous) => ({
      ...previous,
      financialSummary: {
        ...previous.financialSummary,
        outstandingAmount: Math.max(0, amount),
      },
    }));
  }

  function validateStep(stepId: StepId): string | null {
    const state = formState;

    switch (stepId) {
      case "basic": {
        if (!state.code.trim()) {
          return "Informe um código para o contrato.";
        }

        if (!state.clientName || !state.enterpriseName || !state.proposalCode) {
          return "Selecione cliente, empreendimento e proposta.";
        }

        if (!state.signature.deadline) {
          return "Defina um prazo para conclusão da assinatura.";
        }

        if (state.status !== "Assinado" && state.signature.pendingSigners.length === 0) {
          return "Liste ao menos um signatário pendente.";
        }

        return null;
      }
      case "doc": {
        if (!state.docConfig.templateName.trim() || !state.docConfig.templateId.trim()) {
          return "Informe o template e o identificador do documento.";
        }

        return null;
      }
      case "terms": {
        if (!state.terms.startDate || !state.terms.endDate) {
          return "Defina as datas de início e término da vigência.";
        }

        if (state.terms.startDate > state.terms.endDate) {
          return "A data final deve ser posterior à inicial.";
        }

        if (state.terms.responsibilities.length === 0) {
          return "Inclua ao menos uma responsabilidade.";
        }

        if (state.terms.keyClauses.length === 0) {
          return "Adicione as cláusulas principais.";
        }

        return null;
      }
      case "billing": {
        if (state.billing.totalValue <= 0) {
          return "Informe o valor total estimado do contrato.";
        }

        if (state.billing.paymentConditions.length === 0) {
          return "Descreva as condições de pagamento.";
        }

        if (state.billing.taxes.some((tax) => !tax.name.trim())) {
          return "Identifique todos os impostos configurados.";
        }

        return null;
      }
      case "team": {
        if (!state.team.owner) {
          return "Escolha um responsável interno.";
        }

        if (state.team.members.length === 0) {
          return "Selecione os participantes da equipe.";
        }

        return null;
      }
      default:
        return null;
    }
  }

  function buildContract(): Contract | null {
    const client = contractSelectableOptions.clientes.find((item) => item.nome === formState.clientName);
    const enterprise = contractSelectableOptions.empreendimentos.find((item) => item.nome === formState.enterpriseName);
    const proposal = contractSelectableOptions.propostas.find((item) => item.codigo === formState.proposalCode);

    if (!client || !enterprise || !proposal) {
      setError("Não foi possível localizar os dados selecionados. Revise os campos básicos.");
      return null;
    }

    const owner = formState.team.owner;
    const uniqueMembers = [owner, ...formState.team.members.filter((member) => member.id !== owner.id)];
    const totalValue = formState.billing.totalValue || formState.financialSummary.totalValue;
    const executed = formState.financialSummary.executedPercentage;
    const outstanding = formState.financialSummary.outstandingAmount ?? Math.max(0, totalValue * (1 - executed));

    const contract: Contract = {
      id: editingContract?.id ?? `contract-${Math.random().toString(36).slice(2, 9)}`,
      code: formState.code,
      status: formState.status,
      client,
      enterprise,
      proposal,
      signature: {
        ...formState.signature,
        pendingSigners: formState.signature.pendingSigners.filter((signer) => signer.trim()),
      },
      financialSummary: {
        totalValue,
        executedPercentage: executed,
        outstandingAmount: outstanding,
        nextInvoiceDate: formState.financialSummary.nextInvoiceDate,
      },
      docConfig: {
        ...formState.docConfig,
        attachmentUrls: [...formState.docConfig.attachmentUrls],
      },
      terms: {
        ...formState.terms,
        responsibilities: [...formState.terms.responsibilities],
        guarantees: [...formState.terms.guarantees],
        keyClauses: [...formState.terms.keyClauses],
      },
      billing: {
        ...formState.billing,
        taxes: formState.billing.taxes.map((tax) => ({ ...tax })),
        paymentConditions: [...formState.billing.paymentConditions],
      },
      team: {
        mode: formState.team.mode,
        owner,
        members: uniqueMembers,
        communicationChannel: formState.team.communicationChannel,
      },
      highlights: formState.highlights.filter((highlight) => highlight.trim()),
    };

    return contract;
  }

  function handleSubmit() {
    for (const step of steps) {
      const validation = validateStep(step.id);
      if (validation) {
        setCurrentStep(step.id);
        setError(validation);
        return;
      }
    }

    const contract = buildContract();
    if (!contract) {
      return;
    }

    if (editingContract) {
      updateContract(contract.id, contract);
    } else {
      createContract(contract);
    }

    onCompleted?.(contract, editingContract ? "edit" : "create");
    handleClose();
  }

  function handleNextStep() {
    const validation = validateStep(currentStep);
    if (validation) {
      setError(validation);
      return;
    }

    setError(null);
    const index = steps.findIndex((step) => step.id === currentStep);
    const nextStep = steps[index + 1];
    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  }

  function handlePreviousStep() {
    setError(null);
    const index = steps.findIndex((step) => step.id === currentStep);
    const previousStep = steps[index - 1];
    if (previousStep) {
      setCurrentStep(previousStep.id);
    }
  }

  const stepIndex = steps.findIndex((step) => step.id === currentStep);
  const isLastStep = stepIndex === steps.length - 1;
  const executedPercentage = Math.round(formState.financialSummary.executedPercentage * 100);

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title={editingContract ? "Editar contrato" : "Novo contrato"}
      description="Estruture o contrato por etapas para manter rastreabilidade e consistência."
      footer={
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
            >
              Cancelar
            </button>
            {stepIndex > 0 && (
              <button
                type="button"
                onClick={handlePreviousStep}
                className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-text)]"
              >
                Voltar
              </button>
            )}
            <button
              type="button"
              onClick={isLastStep ? handleSubmit : handleNextStep}
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
            >
              {isLastStep ? (editingContract ? "Salvar alterações" : "Criar contrato") : "Avançar"}
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                currentStep === step.id
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "border border-[color:var(--color-border)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {currentStep === "basic" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-code">
                Código do contrato
              </label>
              <input
                id="contract-code"
                value={formState.code}
                onChange={(event) => updateForm({ code: event.target.value })}
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                placeholder="CT-910"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-status">
                  Status operacional
                </label>
                <select
                  id="contract-status"
                  value={formState.status}
                  onChange={(event) => updateForm({ status: event.target.value as ContractStatus })}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                >
                  <option value="Rascunho">Rascunho</option>
                  <option value="Em revisão">Em revisão</option>
                  <option value="Em assinatura">Em assinatura</option>
                  <option value="Assinado">Assinado</option>
                  <option value="Encerrado">Encerrado</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-signature-status">
                  Status de assinatura
                </label>
                <select
                  id="contract-signature-status"
                  value={formState.signature.status}
                  onChange={(event) =>
                    updateForm({ signature: { ...formState.signature, status: event.target.value as ContractSignature["status"] } })
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Parcial">Parcial</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-client">
                  Cliente
                </label>
                <select
                  id="contract-client"
                  value={formState.clientName}
                  onChange={(event) => updateForm({ clientName: event.target.value })}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                >
                  {contractSelectableOptions.clientes.map((cliente) => (
                    <option key={cliente.nome} value={cliente.nome}>
                      {cliente.nome} · {cliente.segmento}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-enterprise">
                  Empreendimento
                </label>
                <select
                  id="contract-enterprise"
                  value={formState.enterpriseName}
                  onChange={(event) => updateForm({ enterpriseName: event.target.value })}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                >
                  {contractSelectableOptions.empreendimentos.map((empreendimento) => (
                    <option key={empreendimento.nome} value={empreendimento.nome}>
                      {empreendimento.nome} · {empreendimento.cidade}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-proposal">
                Proposta vinculada
              </label>
              <select
                id="contract-proposal"
                value={formState.proposalCode}
                onChange={(event) => updateForm({ proposalCode: event.target.value })}
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              >
                {contractSelectableOptions.propostas.map((proposta) => (
                  <option key={proposta.codigo} value={proposta.codigo}>
                    {proposta.codigo} · {proposta.valor}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-signature-deadline">
                  Prazo para assinatura
                </label>
                <input
                  id="contract-signature-deadline"
                  type="date"
                  value={formState.signature.deadline}
                  onChange={(event) =>
                    updateForm({ signature: { ...formState.signature, deadline: event.target.value } })
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-signature-sent">
                  Último envio para assinatura
                </label>
                <input
                  id="contract-signature-sent"
                  type="datetime-local"
                  value={toDateTimeLocal(formState.signature.lastSentAt)}
                  onChange={(event) =>
                    updateForm({ signature: { ...formState.signature, lastSentAt: fromDateTimeLocal(event.target.value) } })
                  }
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-pending-signers">
                Signatários pendentes (um por linha)
              </label>
              <textarea
                id="contract-pending-signers"
                value={formState.signature.pendingSigners.join("\n")}
                onChange={(event) =>
                  updateForm({
                    signature: {
                      ...formState.signature,
                      pendingSigners: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean),
                    },
                  })
                }
                className="min-h-[80px] w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                placeholder="Diretoria jurídica"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-executed">
                  Execução financeira (%)
                </label>
                <input
                  id="contract-executed"
                  type="number"
                  min={0}
                  max={100}
                  value={executedPercentage}
                  onChange={(event) => handleExecutedPercentageChange(Number(event.target.value))}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-outstanding">
                  Saldo a faturar (R$)
                </label>
                <input
                  id="contract-outstanding"
                  type="number"
                  min={0}
                  value={formState.financialSummary.outstandingAmount}
                  onChange={(event) => handleOutstandingAmountChange(Number(event.target.value))}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-next-invoice">
                Próxima fatura prevista
              </label>
              <input
                id="contract-next-invoice"
                type="date"
                value={formState.financialSummary.nextInvoiceDate}
                onChange={(event) =>
                  updateForm({
                    financialSummary: { ...formState.financialSummary, nextInvoiceDate: event.target.value },
                  })
                }
                className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[color:var(--color-text)]" htmlFor="contract-highlights">
                Destaques (um por linha)
              </label>
              <textarea
                id="contract-highlights"
                value={formState.highlights.join("\n")}
                onChange={(event) =>
                  updateForm({ highlights: event.target.value.split(/\n/).map((item) => item.trim()).filter(Boolean) })
                }
                className="min-h-[80px] w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                placeholder="Checklist de implantação completo"
              />
            </div>
          </div>
        )}

        {currentStep === "doc" && (
          <ContractDocConfigForm
            value={formState.docConfig}
            onChange={(docConfig) => updateForm({ docConfig })}
          />
        )}

        {currentStep === "terms" && (
          <ContractTermsForm value={formState.terms} onChange={(terms) => updateForm({ terms })} />
        )}

        {currentStep === "billing" && (
          <ContractBillingForm value={formState.billing} onChange={handleBillingChange} />
        )}

        {currentStep === "team" && (
          <ContractTeamSelector value={formState.team} onChange={(team) => updateForm({ team })} directory={contractTeamDirectory} />
        )}
      </div>
    </Drawer>
  );
}
