"use client";

import { Fragment, useMemo, useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewContratoModal, type ContratoPayload, type ContractModalStep } from "../../components/NewContratoModal";
import { PageHeader } from "../../components/PageHeader";
import { SkeletonCard } from "../../components/skeletons/SkeletonCard";
import { Toast } from "../../components/Toast";
import type { Contract } from "./data";
import { ContractsProvider, useContractsStore } from "./store";
import type { Contract } from "./data";
import { useSalesStore } from "../propostas/store";

type ToastState = {
  message: string;
  type: "success" | "info" | "error";
};

type DrawerState = {
  open: boolean;
  contractId?: string;
  initialStep?: ContractModalStep;
};

export default function ContratosPage() {
  const { contracts, addContract } = useSalesStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  function handleSubmit(contrato: ContratoPayload) {
    addContract({ ...contrato, valorTotal: contrato.valorTotal ?? 0 });
    setToast({ message: "Contrato criado com sucesso.", type: "success" });
    return true;
  }

  return (
    <ContractsProvider>
      <ContractsContent />
    </ContractsProvider>
  );
}

function ContractsContent() {
  const { contracts, selectedContract, selectContract } = useContractsStore();
  const [drawerState, setDrawerState] = useState<DrawerState>({ open: false });
  const [toast, setToast] = useState<ToastState | null>(null);

  const progressPercentage = selectedContract
    ? Math.min(100, Math.round(selectedContract.financialSummary.executedPercentage * 100))
    : 0;

  const uniqueTeamMembers = useMemo(() => {
    if (!selectedContract) {
      return [] as Contract["team"]["members"];
    }

    const seen = new Set<string>();
    return selectedContract.team.members.filter((member) => {
      if (seen.has(member.id)) {
        return false;
      }

      seen.add(member.id);
      return true;
    });
  }, [selectedContract]);

  function openDrawer(mode: "create" | "edit", contract?: Contract, step?: ContractModalStep) {
    if (mode === "create") {
      setDrawerState({ open: true });
      return;
    }

    if (contract) {
      setDrawerState({ open: true, contractId: contract.id, initialStep: step });
    }
  }

  function handleDrawerClose() {
    setDrawerState({ open: false });
  }

  function handleCompleted(contract: Contract, mode: "create" | "edit") {
    setToast({
      message: mode === "create" ? "Contrato criado com sucesso." : "Contrato atualizado com sucesso.",
      type: "success",
    });
    setDrawerState({ open: false });
    selectContract(contract.id);
  }

  return (
    <Fragment>
      <PageHeader
        title="Contratos"
        description="Monitore o ciclo de vida contratual com contexto de assinatura, termos e faturamento."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-full border border-[color:var(--color-accent)] px-5 py-2 text-sm font-semibold text-[color:var(--color-accent)] transition hover:border-[color:var(--color-accent-dark)] hover:text-[color:var(--color-accent-dark)]"
              onClick={() => selectedContract && openDrawer("edit", selectedContract, "basic")}
              disabled={!selectedContract}
            >
              Editar dados básicos
            </button>
            <button
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => openDrawer("create")}
            >
              Novo contrato
            </button>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-2">
        {contracts.map((contract) => (
          <article
            key={contract.id}
            className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{contract.code}</h2>
              <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-accent)]">
                {contract.status}
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-text-muted)]">Cliente: {contract.client.name}</p>
            <div className="rounded-lg bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text-muted)]">
              Vigência
              <p className="text-base font-semibold text-[color:var(--color-text)]">
                {formatDateRange(contract.terms.startDate, contract.terms.endDate)}
              </p>
            </div>
            <div className="text-sm text-[color:var(--color-text-muted)]">
              Valor total estimado:
              <p className="text-base font-semibold text-[color:var(--color-text)]">
                {formatCurrency(contract.financialSummary.totalValue)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-text-muted)]">
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">Revisão jurídica em 7 dias</span>
              <span className="rounded-full border border-[color:var(--color-border)] px-3 py-1">Última atualização há 3 dias</span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Carregamento de cards</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard withBadge />
            <SkeletonCard lines={4} />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
            Contratos ativos
          </h2>
          <div className="space-y-2">
            {contracts.map((contract) => (
              <button
                key={contract.id}
                type="button"
                onClick={() => selectContract(contract.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                  selectedContract?.id === contract.id
                    ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] text-[color:var(--color-text)] hover:border-[color:var(--color-primary)]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{contract.code}</span>
                  <span className="text-xs font-semibold uppercase text-[color:var(--color-text-muted)]">
                    {contract.status}
                  </span>
                </div>
                    <p className="text-xs text-[color:var(--color-text-muted)]">{contract.client.name}</p>
                <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                  Empreendimento: {contract.enterprise.nome}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          {selectedContract ? (
            <>
              <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-[color:var(--color-text)]">
                      {selectedContract.code}
                    </h2>
                    <p className="text-sm text-[color:var(--color-text-muted)]">
                      {selectedContract.client.name} · {selectedContract.client.segment}
                    </p>
                    <p className="text-sm text-[color:var(--color-text-muted)]">
                      Contato: {selectedContract.client.contatoPrincipal.nome} · {selectedContract.client.contatoPrincipal.email}
                    </p>
                  </div>
                  <div className="rounded-full bg-[color:var(--color-accent-soft)] px-4 py-1 text-xs font-semibold uppercase text-[color:var(--color-accent)]">
                    {selectedContract.signature.status}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                      Empreendimento
                    </span>
                    <p className="text-sm font-semibold text-[color:var(--color-text)]">
                      {selectedContract.enterprise.nome}
                    </p>
                    <p className="text-xs text-[color:var(--color-text-muted)]">
                      {selectedContract.enterprise.cidade} · {selectedContract.enterprise.fase}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                      Proposta
                    </span>
                    <p className="text-sm font-semibold text-[color:var(--color-text)]">
                      {selectedContract.proposal.codigo}
                    </p>
                    <p className="text-xs text-[color:var(--color-text-muted)]">
                      {selectedContract.proposal.status} · {selectedContract.proposal.valor}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                      Destaques recentes
                    </span>
                    {selectedContract.highlights.length > 0 ? (
                      <ul className="list-disc space-y-1 pl-4 text-xs text-[color:var(--color-text-muted)]">
                        {selectedContract.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-[color:var(--color-text-muted)]">Sem destaques registrados.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <article className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
                  <header className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[color:var(--color-text)]">Status de assinatura</h3>
                      <p className="text-xs text-[color:var(--color-text-muted)]">
                        Controle de prazos, envios e signatários envolvidos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDrawer("edit", selectedContract, "basic")}
                      className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    >
                      Editar
                    </button>
                  </header>
                  <div className="rounded-xl bg-[color:var(--color-surface-muted)] p-4 text-sm text-[color:var(--color-text-muted)]">
                    <p>
                      Último envio: {new Date(selectedContract.signature.lastSentAt).toLocaleString("pt-BR")}
                    </p>
                    <p>Prazo para conclusão: {selectedContract.signature.deadline}</p>
                    <p className="mt-2 font-semibold text-[color:var(--color-text)]">
                      Pendentes: {selectedContract.signature.pendingSigners.length || "nenhum"}
                    </p>
                    {selectedContract.signature.pendingSigners.length > 0 && (
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                        {selectedContract.signature.pendingSigners.map((signer) => (
                          <li key={signer}>{signer}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>

                <article className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
                  <header className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[color:var(--color-text)]">Resumo financeiro</h3>
                      <p className="text-xs text-[color:var(--color-text-muted)]">Valores previstos e faturamento em andamento.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openDrawer("edit", selectedContract, "billing")}
                      className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    >
                      Editar
                    </button>
                  </header>
                  <div className="space-y-3 text-sm text-[color:var(--color-text-muted)]">
                    <div className="flex items-center justify-between text-base font-semibold text-[color:var(--color-text)]">
                      <span>Total previsto</span>
                      <span>{formatCurrency(selectedContract.financialSummary.totalValue)}</span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Execução</span>
                        <span>{progressPercentage}%</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color:var(--color-border)]">
                        <div
                          className="h-full rounded-full bg-[color:var(--color-primary)]"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                    <p>Saldo em aberto: {formatCurrency(selectedContract.financialSummary.outstandingAmount)}</p>
                    <p>Próxima fatura: {selectedContract.financialSummary.nextInvoiceDate}</p>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Condições de pagamento</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {selectedContract.billing.paymentConditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </section>

              <section className="grid gap-5 lg:grid-cols-2">
                <article className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
                  <header className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[color:var(--color-text)]">Template & documento</h3>
                    <button
                      type="button"
                      onClick={() => openDrawer("edit", selectedContract, "doc")}
                      className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    >
                      Editar
                    </button>
                  </header>
                  <dl className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
                    <div>
                      <dt className="text-xs uppercase tracking-wide">Template</dt>
                      <dd className="font-semibold text-[color:var(--color-text)]">
                        {selectedContract.docConfig.templateName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide">Versão</dt>
                      <dd>{selectedContract.docConfig.version}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide">Plataforma</dt>
                      <dd>{selectedContract.docConfig.signaturePlatform}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide">Última atualização</dt>
                      <dd>{selectedContract.docConfig.lastUpdated}</dd>
                    </div>
                  </dl>
                  {selectedContract.docConfig.attachmentUrls.length > 0 && (
                    <div className="text-xs text-[color:var(--color-text-muted)]">
                      <p className="font-semibold uppercase tracking-wide">Anexos</p>
                      <ul className="mt-1 space-y-1">
                        {selectedContract.docConfig.attachmentUrls.map((url) => (
                          <li key={url} className="truncate">
                            <a
                              href={url}
                              className="text-[color:var(--color-primary)] underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {selectedContract.docConfig.requiresWitness && (
                      <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 font-semibold text-[color:var(--color-accent)]">
                        Testemunhas obrigatórias
                      </span>
                    )}
                    {selectedContract.docConfig.sendForLegalReview && (
                      <span className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 font-semibold text-[color:var(--color-text)]">
                        Revisão jurídica automática
                      </span>
                    )}
                    {selectedContract.docConfig.autoReminders && (
                      <span className="rounded-full bg-[color:var(--color-surface-muted)] px-3 py-1 font-semibold text-[color:var(--color-text)]">
                        Lembretes habilitados
                      </span>
                    )}
                  </div>
                </article>

                <article className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
                  <header className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[color:var(--color-text)]">Cláusulas e garantias</h3>
                    <button
                      type="button"
                      onClick={() => openDrawer("edit", selectedContract, "terms")}
                      className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                    >
                      Editar
                    </button>
                  </header>
                  <div className="grid gap-3 text-sm text-[color:var(--color-text-muted)]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Vigência</p>
                      <p>
                        {selectedContract.terms.startDate} até {selectedContract.terms.endDate} · Renovação {selectedContract.terms.renewal}
                      </p>
                      <p>Aviso prévio: {selectedContract.terms.noticePeriodDays} dias</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Responsabilidades</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {selectedContract.terms.responsibilities.map((responsibility) => (
                          <li key={responsibility}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Garantias</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {selectedContract.terms.guarantees.map((guarantee) => (
                          <li key={guarantee}>{guarantee}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide">Cláusulas principais</p>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {selectedContract.terms.keyClauses.map((clause) => (
                          <li key={clause}>{clause}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              </section>

              <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
                <header className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[color:var(--color-text)]">Equipe envolvida</h3>
                  <button
                    type="button"
                    onClick={() => openDrawer("edit", selectedContract, "team")}
                    className="rounded-full border border-[color:var(--color-border)] px-3 py-1 text-xs font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                  >
                    Editar
                  </button>
                </header>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 text-sm text-[color:var(--color-text-muted)]">
                    <p>
                      <span className="font-semibold text-[color:var(--color-text)]">Responsável: </span>
                      {selectedContract.team.owner.name} ({selectedContract.team.owner.role})
                    </p>
                    <p>Modo de trabalho: {selectedContract.team.mode}</p>
                    <p>Canal principal: {selectedContract.team.communicationChannel}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-text-muted)]">
                      Membros ativos
                    </p>
                    <ul className="space-y-2 text-sm text-[color:var(--color-text)]">
                      {uniqueTeamMembers.map((member) => (
                        <li key={member.id} className="rounded-lg border border-[color:var(--color-border)] px-3 py-2">
                          <p className="font-semibold">
                            {member.name}
                            <span className="ml-2 text-xs uppercase text-[color:var(--color-text-muted)]">{member.type}</span>
                          </p>
                          <p className="text-xs text-[color:var(--color-text-muted)]">{member.role}</p>
                          <p className="text-xs text-[color:var(--color-text-muted)]">{member.email}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <EmptyState
              title="Nenhum contrato selecionado"
              description="Escolha um contrato na lista ou cadastre um novo para visualizar os detalhes."
              actionLabel="Criar contrato"
              onAction={() => openDrawer("create")}
            />
          )}
        </main>
      </div>

      <NewContratoModal
        open={drawerState.open}
        onClose={handleDrawerClose}
        contractId={drawerState.contractId}
        initialStep={drawerState.initialStep}
        onCompleted={handleCompleted}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </Fragment>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR");
}

function formatDateRange(start: string, end: string) {
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
