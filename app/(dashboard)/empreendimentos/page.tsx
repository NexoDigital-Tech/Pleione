"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "../../components/EmptyState";
import { NewEmpreendimentoModal } from "../../components/NewEmpreendimentoModal";
import { PageHeader } from "../../components/PageHeader";
import { Toast } from "../../components/Toast";
import {
  ENTERPRISE_CONTACTS,
  ENTERPRISE_PHASES,
  ENTERPRISE_STATUSES,
  Enterprise,
  getClientById,
  getContactById,
  useEnterpriseStore,
} from "./data";

type ToastState = {
  message: string;
  type: "success" | "error" | "info";
};

export default function EmpreendimentosPage() {
  const { enterprises, addEnterprise } = useEnterpriseStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => {
      const matchesPhase = phaseFilter ? enterprise.phase === phaseFilter : true;
      const matchesStatus = statusFilter ? enterprise.status === statusFilter : true;
      return matchesPhase && matchesStatus;
    });
  }, [enterprises, phaseFilter, statusFilter]);

  function handleSubmit(enterprise: Enterprise) {
    addEnterprise(enterprise);
    setToast({ message: "Empreendimento cadastrado com sucesso.", type: "success" });
    return true;
  }

  const emptyStateVisible = filteredEnterprises.length === 0;

  const licencesRows = useMemo(() => {
    return filteredEnterprises.flatMap((enterprise) =>
      enterprise.licences.map((licence) => ({
        enterprise,
        licence,
      }))
    );
  }, [filteredEnterprises]);

  const documentsRows = useMemo(() => {
    return filteredEnterprises.flatMap((enterprise) =>
      enterprise.documents.map((document) => ({
        enterprise,
        document,
      }))
    );
  }, [filteredEnterprises]);

  return (
    <>
      <PageHeader
        title="Empreendimentos"
        description="Acompanhe cadastros, localização, conformidade e documentos dos empreendimentos mockados."
        actions={
          <>
            <div className="hidden gap-2 text-sm text-[color:var(--color-text-muted)] md:flex">
              <select
                value={phaseFilter}
                onChange={(event) => setPhaseFilter(event.target.value)}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 focus:border-[color:var(--color-primary)] focus:outline-none"
              >
                <option value="">Todas as fases</option>
                {ENTERPRISE_PHASES.map((phase) => (
                  <option key={phase} value={phase}>
                    {phase}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 focus:border-[color:var(--color-primary)] focus:outline-none"
              >
                <option value="">Todos os status</option>
                {ENTERPRISE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <button
              className="rounded-full bg-[color:var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--color-primary-dark)]"
              onClick={() => setModalOpen(true)}
            >
              Novo empreendimento
            </button>
          </>
        }
      />

      <div className="mb-6 flex flex-col gap-3 md:hidden">
        <label className="text-sm font-medium text-[color:var(--color-text)]">Filtrar por fase</label>
        <select
          value={phaseFilter}
          onChange={(event) => setPhaseFilter(event.target.value)}
          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 focus:border-[color:var(--color-primary)] focus:outline-none"
        >
          <option value="">Todas as fases</option>
          {ENTERPRISE_PHASES.map((phase) => (
            <option key={phase} value={phase}>
              {phase}
            </option>
          ))}
        </select>
        <label className="text-sm font-medium text-[color:var(--color-text)]">Filtrar por status</label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-2 focus:border-[color:var(--color-primary)] focus:outline-none"
        >
          <option value="">Todos os status</option>
          {ENTERPRISE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredEnterprises.map((enterprise) => {
          const client = getClientById(enterprise.clientId);
          const contact = getContactById(enterprise.contactId);
          const complianceFlags = [
            enterprise.flags.environmentalCompliance ? "Ambiental OK" : "Ambiental pendente",
            enterprise.flags.socialCompliance ? "Social OK" : "Social pendente",
            enterprise.flags.safetyCompliance ? "Segurança OK" : "Segurança pendente",
          ];

          return (
            <article
              key={enterprise.id}
              className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{enterprise.name}</h2>
                  <p className="text-sm text-[color:var(--color-text-muted)]">
                    {enterprise.phase} • {enterprise.status}
                  </p>
                </div>
                <span className="rounded-full bg-[color:var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--color-accent)]">
                  {enterprise.complianceScore}% compliance
                </span>
              </div>
              <p className="text-sm text-[color:var(--color-text-muted)]">{enterprise.description}</p>
              <div className="grid gap-2 text-xs text-[color:var(--color-text-muted)] sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-[color:var(--color-text)]">Cliente: </span>
                  {client?.name ?? "—"}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--color-text)]">Contato: </span>
                  {contact ? contact.name : "—"}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--color-text)]">Início: </span>
                  {enterprise.startDate ? new Date(enterprise.startDate).toLocaleDateString("pt-BR") : "—"}
                </p>
                <p>
                  <span className="font-semibold text-[color:var(--color-text)]">Gestor: </span>
                  {enterprise.manager || "—"}
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-xs text-[color:var(--color-text-muted)]">
                  <span>Progresso geral</span>
                  <span>{enterprise.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-[color:var(--color-surface-muted)]">
                  <div
                    className="h-2 rounded-full bg-[color:var(--color-accent)]"
                    style={{ width: `${enterprise.progress}%` }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-[color:var(--color-text-muted)]">
                {complianceFlags.map((flag) => (
                  <span key={flag} className="rounded-full border border-[color:var(--color-border)] px-3 py-1">
                    {flag}
                  </span>
                ))}
                {enterprise.flags.hasPendingNotifications && (
                  <span className="rounded-full bg-[color:var(--color-danger-soft)] px-3 py-1 text-[color:var(--color-danger)]">
                    Notificações ativas
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {emptyStateVisible ? (
        <EmptyState
          title="Nenhum empreendimento corresponde aos filtros"
          description="Altere os filtros de fase e status ou cadastre um novo empreendimento."
          actionLabel="Limpar filtros"
          onAction={() => {
            setPhaseFilter("");
            setStatusFilter("");
          }}
        />
      ) : (
        <div className="space-y-8">
          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
            <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Resumo de localizações</h2>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Cidades, estados e áreas dos empreendimentos ativos conforme filtros.
                </p>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[color:var(--color-border)] text-left text-sm">
                <thead className="text-xs uppercase text-[color:var(--color-text-muted)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Empreendimento</th>
                    <th className="px-3 py-2 font-semibold">Cidade/UF</th>
                    <th className="px-3 py-2 font-semibold">Endereço</th>
                    <th className="px-3 py-2 font-semibold">Área</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                  {filteredEnterprises.map((enterprise) => (
                    <tr key={`location-${enterprise.id}`}>
                      <td className="px-3 py-3 text-[color:var(--color-text)]">{enterprise.name}</td>
                      <td className="px-3 py-3">
                        {enterprise.location.city} / {enterprise.location.state}
                      </td>
                      <td className="px-3 py-3">
                        {enterprise.location.address}
                        {enterprise.location.postalCode ? ` • CEP ${enterprise.location.postalCode}` : ""}
                      </td>
                      <td className="px-3 py-3">{enterprise.location.area || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
            <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Conformidade e perfil ambiental</h2>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Status de compliance, classificação de risco e notas registradas.
                </p>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[color:var(--color-border)] text-left text-sm">
                <thead className="text-xs uppercase text-[color:var(--color-text-muted)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Empreendimento</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Classificação</th>
                    <th className="px-3 py-2 font-semibold">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                  {filteredEnterprises.map((enterprise) => (
                    <tr key={`compliance-${enterprise.id}`}>
                      <td className="px-3 py-3 text-[color:var(--color-text)]">{enterprise.name}</td>
                      <td className="px-3 py-3">
                        {enterprise.status}
                        {enterprise.flags.hasPendingNotifications ? " • Pendências" : ""}
                      </td>
                      <td className="px-3 py-3">{enterprise.envProfile.classification}</td>
                      <td className="px-3 py-3">{enterprise.envProfile.notes || enterprise.flags.notes || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
            <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Licenças vigentes</h2>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Consolidação das licenças selecionadas a partir do catálogo.
                </p>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[color:var(--color-border)] text-left text-sm">
                <thead className="text-xs uppercase text-[color:var(--color-text-muted)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Empreendimento</th>
                    <th className="px-3 py-2 font-semibold">Licença</th>
                    <th className="px-3 py-2 font-semibold">Categoria</th>
                    <th className="px-3 py-2 font-semibold">Vigência</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                  {licencesRows.map(({ enterprise, licence }) => (
                    <tr key={`${enterprise.id}-${licence.id}`}>
                      <td className="px-3 py-3 text-[color:var(--color-text)]">{enterprise.name}</td>
                      <td className="px-3 py-3">{licence.name}</td>
                      <td className="px-3 py-3">{licence.category}</td>
                      <td className="px-3 py-3">
                        {licence.validUntil ? new Date(licence.validUntil).toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td className="px-3 py-3">{licence.status}</td>
                    </tr>
                  ))}
                  {licencesRows.length === 0 && (
                    <tr>
                      <td className="px-3 py-4 text-center text-[color:var(--color-text-muted)]" colSpan={5}>
                        Nenhuma licença adicionada para os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-5 shadow-sm">
            <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text)]">Documentos anexados</h2>
                <p className="text-sm text-[color:var(--color-text-muted)]">
                  Versionamento mockado de memoriais, relatórios e anexos de compliance.
                </p>
              </div>
            </header>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[color:var(--color-border)] text-left text-sm">
                <thead className="text-xs uppercase text-[color:var(--color-text-muted)]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Empreendimento</th>
                    <th className="px-3 py-2 font-semibold">Documento</th>
                    <th className="px-3 py-2 font-semibold">Categoria</th>
                    <th className="px-3 py-2 font-semibold">Responsável</th>
                    <th className="px-3 py-2 font-semibold">Upload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--color-border)] text-[color:var(--color-text-muted)]">
                  {documentsRows.map(({ enterprise, document }) => (
                    <tr key={`${enterprise.id}-${document.id}`}>
                      <td className="px-3 py-3 text-[color:var(--color-text)]">{enterprise.name}</td>
                      <td className="px-3 py-3">{document.name}</td>
                      <td className="px-3 py-3">{document.category}</td>
                      <td className="px-3 py-3">{document.owner}</td>
                      <td className="px-3 py-3">
                        {document.uploadedAt
                          ? new Date(document.uploadedAt).toLocaleDateString("pt-BR")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {documentsRows.length === 0 && (
                    <tr>
                      <td className="px-3 py-4 text-center text-[color:var(--color-text-muted)]" colSpan={5}>
                        Nenhum documento anexado para os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      <NewEmpreendimentoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        contacts={ENTERPRISE_CONTACTS}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
