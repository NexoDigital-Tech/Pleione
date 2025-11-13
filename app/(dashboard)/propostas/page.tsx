"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewProposalSheet } from "../../components/NewProposalSheet";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonTable } from "../../components/skeletons/SkeletonTable";
import { Toast } from "../../components/Toast";
import type { Proposal, ProposalDraft } from "./data";
import { useSalesStore } from "./store";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

type ViewMode = "cards" | "table";

const approvalBadge: Record<string, string> = {
  Aprovado: "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
  Pendente: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
  Reprovado: "bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]",
};

const paymentBadge: Record<string, string> = {
  "Em dia": "bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]",
  "Em atraso": "bg-[color:var(--color-danger-soft)] text-[color:var(--color-danger)]",
  Quitado: "bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function getScheduleProgress(proposal: Proposal) {
  if (!proposal.schedule.phases.length) {
    return 0;
  }

  const total = proposal.schedule.phases.reduce((accumulator, phase) => accumulator + phase.progress, 0);
  return Math.round(total / proposal.schedule.phases.length);
}

function getServicesTotal(proposal: Proposal) {
  return proposal.services.reduce((total, service) => total + service.unitPrice * service.quantity, 0);
}

function getApprovalStatus(proposal: Proposal) {
  const statuses = proposal.approval.steps.map((step) => step.status);

  if (statuses.every((status) => status === "approved") && statuses.length) {
    return "Aprovado";
  }

  if (statuses.some((status) => status === "rejected")) {
    return "Reprovado";
  }

  return "Pendente";
}

function getPaymentStatus(proposal: Proposal) {
  const statuses = proposal.paymentPlan.installments.map((installment) => installment.status);

  if (statuses.length === 0) {
    return "Em dia";
  }

  if (statuses.every((status) => status === "paid")) {
    return "Quitado";
  }

  if (statuses.some((status) => status === "overdue")) {
    return "Em atraso";
  }

  return "Em dia";
}

function getPendingMilestone(proposal: Proposal) {
  return proposal.milestones.find((milestone) => milestone.status !== "completed");
}

export default function PropostasPage() {
  const {
    proposals,
    addProposal,
    convertProposalToContract,
  } = useSalesStore();
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const sortedProposals = useMemo(
    () =>
      [...proposals].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [proposals]
  );

  function handleCreate(proposal: ProposalDraft) {
    addProposal(proposal);
    setToast({ message: "Proposta criada com sucesso.", type: "success" });
    return true;
  }

  function handleConvert(proposalId: string) {
    const contract = convertProposalToContract(proposalId);
    if (contract) {
      setToast({ message: `Proposta vinculada ao contrato ${contract.codigo}.`, type: "success" });
    } else {
      setToast({ message: "Não foi possível converter a proposta.", type: "error" });
    }
  }

  return (
    <>
      <PageHeader
        title="Propostas"
        description="Acompanhe cronogramas, marcos, serviços e status financeiro das propostas em negociação."
        actions={
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setViewMode((previous) => (previous === "cards" ? "table" : "cards"))}
              className="rounded-full border border-[color:var(--color-border)] px-5 py-2 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
            >
              {viewMode === "cards" ? "Visão em tabela" : "Visão em cards"}
            </button>
            <button
              type="button"
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => setSheetOpen(true)}
            >
              Nova proposta
            </button>
          </div>
        }
      />

      {sortedProposals.length === 0 ? (
        <EmptyState
          title="Nenhuma proposta cadastrada"
          description="Crie uma nova proposta para acompanhar o funil comercial e gerar contratos."
          actionLabel="Cadastrar proposta"
          onAction={() => setSheetOpen(true)}
        />
      ) : viewMode === "cards" ? (
        <section className="grid gap-5 xl:grid-cols-2">
          {sortedProposals.map((proposal) => {
            const approvalStatus = getApprovalStatus(proposal);
            const paymentStatus = getPaymentStatus(proposal);
            const pendingMilestone = getPendingMilestone(proposal);
            const scheduleProgress = getScheduleProgress(proposal);
            const servicesTotal = getServicesTotal(proposal);

            return (
              <article
                key={proposal.id}
                className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-6 shadow-sm"
              >
                <header className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
                      {proposal.code}
                    </p>
                    <h2 className="text-lg font-semibold text-[color:var(--color-text)]">
                      {proposal.title}
                    </h2>
                    <p className="text-sm text-[color:var(--color-text-muted)]">{proposal.client}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-xs">
                    <span className="rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 font-semibold text-[color:var(--color-primary)]">
                      {proposal.status}
                    </span>
                    <span className="text-[color:var(--color-text-muted)]">
                      Probabilidade: {(proposal.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                </header>

                <div className="grid gap-4 rounded-xl bg-[color:var(--color-surface)] p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-[color:var(--color-text-muted)]">Cronograma</p>
                    <span className="text-sm font-semibold text-[color:var(--color-text)]">
                      {scheduleProgress}% concluído
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[color:var(--color-surface-muted)]">
                    <div
                      className="h-2 rounded-full bg-[color:var(--color-accent)] transition-all"
                      style={{ width: `${scheduleProgress}%` }}
                    />
                  </div>
                  {pendingMilestone ? (
                    <p className="text-xs text-[color:var(--color-text-muted)]">
                      Próximo marco: <span className="font-medium text-[color:var(--color-text)]">{pendingMilestone.title}</span> • {pendingMilestone.expectedDate}
                    </p>
                  ) : (
                    <p className="text-xs text-[color:var(--color-text-muted)]">Todos os marcos concluídos.</p>
                  )}
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border border-[color:var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Serviços</p>
                    <p className="mt-2 text-lg font-semibold text-[color:var(--color-text)]">
                      {formatCurrency(servicesTotal)}
                    </p>
                    <p className="text-xs text-[color:var(--color-text-muted)]">
                      {proposal.services.length} itens selecionados
                    </p>
                  </div>
                  <div className="rounded-xl border border-[color:var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Aprovação</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        approvalBadge[approvalStatus] ?? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]"
                      }`}
                    >
                      {approvalStatus}
                    </span>
                    <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">
                      Contato: {proposal.approval.mainContact.name}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[color:var(--color-border)] p-4">
                    <p className="text-xs uppercase tracking-wide text-[color:var(--color-text-muted)]">Pagamentos</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        paymentBadge[paymentStatus] ?? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                    <p className="mt-2 text-xs text-[color:var(--color-text-muted)]">
                      {proposal.paymentPlan.installments.filter((installment) => installment.status === "paid").length} de {proposal.paymentPlan.installments.length} parcelas pagas
                    </p>
                  </div>
                </div>

                <footer className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-[color:var(--color-text-muted)]">
                    Atualizada em {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="rounded-full border border-[color:var(--color-border)] px-4 py-2 text-xs font-semibold text-[color:var(--color-text-muted)] transition hover:text-[color:var(--color-text)]"
                    >
                      Ver detalhes
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[color:var(--color-accent-dark)]"
                      onClick={() => handleConvert(proposal.id)}
                    >
                      Converter em contrato
                    </button>
                  </div>
                </footer>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-sm">
          <table className="min-w-full divide-y divide-[color:var(--color-border)]">
            <thead className="bg-[color:var(--color-surface-muted)] text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
              <tr>
                <th className="px-5 py-3 text-left">Proposta</th>
                <th className="px-5 py-3 text-left">Cronograma</th>
                <th className="px-5 py-3 text-left">Serviços</th>
                <th className="px-5 py-3 text-left">Aprovação</th>
                <th className="px-5 py-3 text-left">Pagamentos</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border)] text-sm text-[color:var(--color-text-muted)]">
              {sortedProposals.map((proposal) => {
                const approvalStatus = getApprovalStatus(proposal);
                const paymentStatus = getPaymentStatus(proposal);
                const scheduleProgress = getScheduleProgress(proposal);
                const servicesTotal = getServicesTotal(proposal);

                return (
                  <tr key={proposal.id}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[color:var(--color-text)]">{proposal.code}</p>
                      <p>{proposal.client}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[color:var(--color-text)]">{scheduleProgress}%</p>
                      <p>Encerramento {new Date(proposal.schedule.deadline).toLocaleDateString("pt-BR")}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-[color:var(--color-text)]">{formatCurrency(servicesTotal)}</p>
                      <p>{proposal.services.length} serviços</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          approvalBadge[approvalStatus] ?? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        {approvalStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          paymentBadge[paymentStatus] ?? "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-muted)]"
                        }`}
                      >
                        {paymentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        className="rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[color:var(--color-accent-dark)]"
                        onClick={() => handleConvert(proposal.id)}
                      >
                        Gerar contrato
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estados de carregamento</h2>
          <SkeletonTable rows={3} columns={5} />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Estado vazio</h2>
          <EmptyState
            title="Nenhum registro filtrado"
            description="Ajuste filtros ou cadastre uma nova proposta para visualizar resultados."
            actionLabel="Criar proposta"
            onAction={() => setSheetOpen(true)}
          />
        </div>
      </section>

      <NewProposalSheet open={sheetOpen} onClose={() => setSheetOpen(false)} onSubmit={handleCreate} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
