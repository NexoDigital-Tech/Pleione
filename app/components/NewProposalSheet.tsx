"use client";

import { useState } from "react";

import type { ProposalDraft, ProposalService } from "../(dashboard)/propostas/data";
import { proposalServiceCatalog } from "../(dashboard)/propostas/data";
import { ProposalApprovalChecklist } from "./ProposalApprovalChecklist";
import { Drawer } from "./Drawer";
import { MilestonesEditor } from "./MilestonesEditor";
import { PaymentPlanBuilder } from "./PaymentPlanBuilder";
import { ProposalScheduleForm } from "./ProposalScheduleForm";
import { ServicesSelector } from "./ServicesSelector";

type StepId = "general" | "schedule" | "milestones" | "services" | "payments" | "approval";

interface Step {
  id: StepId;
  title: string;
  description: string;
}

interface NewProposalSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: ProposalDraft) => boolean | void;
}

const steps: Step[] = [
  {
    id: "general",
    title: "Dados gerais",
    description: "Código, cliente, segmento e posicionamento da proposta.",
  },
  {
    id: "schedule",
    title: "Cronograma",
    description: "Período estimado e fases previstas.",
  },
  {
    id: "milestones",
    title: "Marcos",
    description: "Eventos-chave para monitoramento de entregas.",
  },
  {
    id: "services",
    title: "Serviços",
    description: "Itens contratados, quantidades e valores.",
  },
  {
    id: "payments",
    title: "Pagamento",
    description: "Parcelas, juros e métodos aceitos.",
  },
  {
    id: "approval",
    title: "Aprovação",
    description: "Fluxo de aprovação e responsáveis pelo contato.",
  },
];

function createInitialDraft(): ProposalDraft {
  return {
    id: undefined,
    code: "",
    title: "",
    client: "",
    segment: "",
    status: "Rascunho",
    createdAt: undefined,
    probability: 0.5,
    schedule: {
      kickoff: "",
      deadline: "",
      phases: [],
      notes: "",
    },
    milestones: [],
    services: [],
    paymentPlan: {
      totalValue: 0,
      currency: "BRL",
      upfrontPercentage: 0,
      interestRate: 0,
      installments: [],
      acceptedMethods: [
        { method: "Pix", accepted: true },
        { method: "Boleto", accepted: true },
        { method: "Cartão corporativo", accepted: false },
      ],
      penaltyPolicy: "",
    },
    approval: {
      flowName: "",
      steps: [],
      mainContact: {
        name: "",
        role: "",
        email: "",
        phone: "",
      },
      observations: "",
    },
    notes: "",
    linkedContractId: undefined,
  };
}

type StepErrors = Partial<Record<StepId, string[]>>;

export function NewProposalSheet({ open, onClose, onSubmit }: NewProposalSheetProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [draft, setDraft] = useState<ProposalDraft>(() => createInitialDraft());
  const [errors, setErrors] = useState<StepErrors>({});

  function resetState() {
    setDraft(createInitialDraft());
    setCurrentStep(0);
    setErrors({});
  }

  function handleClose() {
    resetState();
    onClose();
  }

  function updateDraft(partial: Partial<ProposalDraft>) {
    setDraft((previous) => ({ ...previous, ...partial }));
  }

  function validateStep(stepId: StepId, nextDraft: ProposalDraft = draft) {
    const messages: string[] = [];

    if (stepId === "general") {
      if (!nextDraft.code.trim()) {
        messages.push("Informe o código da proposta.");
      }
      if (!nextDraft.title.trim()) {
        messages.push("Adicione um título descritivo.");
      }
      if (!nextDraft.client.trim()) {
        messages.push("Selecione ou informe o cliente.");
      }
      if (!nextDraft.segment.trim()) {
        messages.push("Preencha o segmento atendido.");
      }
    }

    if (stepId === "schedule") {
      if (!nextDraft.schedule.kickoff || !nextDraft.schedule.deadline) {
        messages.push("Defina datas de início e término do cronograma.");
      }
      if (nextDraft.schedule.phases.length === 0) {
        messages.push("Adicione ao menos uma fase no cronograma.");
      }
    }

    if (stepId === "milestones") {
      if (nextDraft.milestones.length === 0) {
        messages.push("Cadastre pelo menos um marco para acompanhamento.");
      }
    }

    if (stepId === "services") {
      if (nextDraft.services.length === 0) {
        messages.push("Inclua serviços para compor o valor da proposta.");
      }
      nextDraft.services.forEach((service, index) => {
        if (!service.name.trim()) {
          messages.push(`Informe o nome do serviço #${index + 1}.`);
        }
        if (service.unitPrice <= 0) {
          messages.push(`Defina um valor maior que zero para ${service.name || `o serviço #${index + 1}`}.`);
        }
      });
    }

    if (stepId === "payments") {
      if (nextDraft.paymentPlan.totalValue <= 0) {
        messages.push("O valor total da proposta deve ser maior que zero.");
      }
      if (nextDraft.paymentPlan.installments.length === 0) {
        messages.push("Configure ao menos uma parcela de pagamento.");
      }
      if (!nextDraft.paymentPlan.acceptedMethods.some((method) => method.accepted)) {
        messages.push("Marque pelo menos uma forma de pagamento aceita.");
      }
      const installmentsTotal = nextDraft.paymentPlan.installments.reduce(
        (accumulator, installment) => accumulator + installment.amount,
        0
      );
      if (Math.abs(installmentsTotal - nextDraft.paymentPlan.totalValue) > 1) {
        messages.push("A soma das parcelas deve corresponder ao valor total.");
      }
    }

    if (stepId === "approval") {
      if (!nextDraft.approval.flowName.trim()) {
        messages.push("Informe o nome do fluxo de aprovação.");
      }
      if (!nextDraft.approval.mainContact.name.trim()) {
        messages.push("Adicione o contato principal do cliente.");
      }
      if (!nextDraft.approval.mainContact.email.trim()) {
        messages.push("Informe um e-mail de contato.");
      }
      if (nextDraft.approval.steps.length === 0) {
        messages.push("Cadastre ao menos uma etapa de aprovação.");
      }
    }

    setErrors((previous) => ({ ...previous, [stepId]: messages }));
    return messages.length === 0;
  }

  function handleNext() {
    const stepId = steps[currentStep].id;
    if (!validateStep(stepId)) {
      return;
    }
    setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
  }

  function handleBack() {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  function handleServicesChange(services: ProposalService[]) {
    const total = services.reduce((accumulator, service) => accumulator + service.unitPrice * service.quantity, 0);
    const installments =
      draft.paymentPlan.installments.length > 0
        ? draft.paymentPlan.installments
        : total > 0
        ? [
            {
              id: `inst-draft-${Date.now()}`,
              sequence: 1,
              dueDate: draft.schedule.kickoff || "",
              amount: total,
              status: "pending" as const,
              method:
                draft.paymentPlan.acceptedMethods.find((method) => method.accepted)?.method ?? "Pix",
            },
          ]
        : [];
    updateDraft({
      services,
      paymentPlan: {
        ...draft.paymentPlan,
        totalValue: total,
        installments,
      },
    });
  }

  function handleSubmit() {
    let isValid = true;

    steps.forEach((step) => {
      if (!validateStep(step.id, draft)) {
        isValid = false;
      }
    });

    if (!isValid) {
      return;
    }

    const result = onSubmit(draft);

    if (result !== false) {
      handleClose();
    }
  }

  const currentStepId = steps[currentStep].id;
  const stepErrors = errors[currentStepId] ?? [];
  const [primaryError, ...additionalErrors] = stepErrors;
  const stepDescription = steps[currentStep].description;

  const footer = (
    <div className="flex justify-between gap-3">
      <button
        type="button"
        onClick={currentStep === 0 ? handleClose : handleBack}
        className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
      >
        {currentStep === 0 ? "Cancelar" : "Voltar"}
      </button>
      {currentStep === steps.length - 1 ? (
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
        >
          Concluir proposta
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="rounded-full bg-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-accent-dark)]"
        >
          Avançar
        </button>
      )}
    </div>
  );

  return (
    <Drawer
      open={open}
      onClose={handleClose}
      title="Nova proposta"
      description="Cadastre informações completas para gerar proposta e habilitar conversão em contrato."
      footer={footer}
    >
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <span
                key={step.id}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                  isActive
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]"
                    : isCompleted
                    ? "border-[color:var(--color-success)] bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]"
                    : "border-[color:var(--color-border)]"
                }`}
              >
                <span>{index + 1}</span>
                <span>{step.title}</span>
              </span>
            );
          })}
        </nav>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{steps[currentStep].title}</h2>
            <p className="text-sm text-[color:var(--color-text-muted)]">{stepDescription}</p>
          </div>

          {currentStepId === "general" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Código</label>
                  <input
                    value={draft.code}
                    onChange={(event) => updateDraft({ code: event.target.value })}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Cliente</label>
                  <input
                    value={draft.client}
                    onChange={(event) => updateDraft({ client: event.target.value })}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Título</label>
                  <input
                    value={draft.title}
                    onChange={(event) => updateDraft({ title: event.target.value })}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Segmento</label>
                  <input
                    value={draft.segment}
                    onChange={(event) => updateDraft({ segment: event.target.value })}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Status</label>
                  <select
                    value={draft.status}
                    onChange={(event) => updateDraft({ status: event.target.value as ProposalDraft["status"] })}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  >
                    <option value="Rascunho">Rascunho</option>
                    <option value="Em negociação">Em negociação</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Reprovado">Reprovado</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[color:var(--color-text)]">Probabilidade (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={Math.round(draft.probability * 100)}
                    onChange={(event) => {
                      const parsed = Number(event.target.value);
                      updateDraft({ probability: Number.isNaN(parsed) ? draft.probability : parsed / 100 });
                    }}
                    className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-[color:var(--color-text)]">Notas internas</label>
                <textarea
                  value={draft.notes ?? ""}
                  onChange={(event) => updateDraft({ notes: event.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-text)] focus:border-[color:var(--color-primary)] focus:outline-none"
                />
              </div>
              {primaryError && (
                <p className="text-sm text-[color:var(--color-danger)]">{primaryError}</p>
              )}
            </div>
          )}

          {currentStepId === "schedule" && (
            <ProposalScheduleForm
              value={draft.schedule}
              onChange={(schedule) => updateDraft({ schedule })}
              error={primaryError}
            />
          )}

          {currentStepId === "milestones" && (
            <MilestonesEditor
              milestones={draft.milestones}
              onChange={(milestones) => updateDraft({ milestones })}
              error={primaryError}
            />
          )}

          {currentStepId === "services" && (
            <ServicesSelector
              services={draft.services}
              catalog={proposalServiceCatalog}
              onChange={handleServicesChange}
              error={primaryError}
            />
          )}

          {currentStepId === "payments" && (
            <PaymentPlanBuilder
              value={draft.paymentPlan}
              onChange={(paymentPlan) => updateDraft({ paymentPlan })}
              error={primaryError}
            />
          )}

          {currentStepId === "approval" && (
            <ProposalApprovalChecklist
              value={draft.approval}
              onChange={(approval) => updateDraft({ approval })}
              error={primaryError}
            />
          )}

          {additionalErrors.length > 0 && (
            <ul className="space-y-1 rounded-lg border border-[color:var(--color-danger)] bg-[color:var(--color-danger-soft)] px-3 py-2 text-xs text-[color:var(--color-danger)]">
              {additionalErrors.map((message) => (
                <li key={message}>• {message}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Drawer>
  );
}
