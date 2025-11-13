"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import {
  ContractSummary,
  Proposal,
  ProposalDraft,
  contractMocks,
  proposalMocks,
} from "./data";

interface SalesStoreValue {
  proposals: Proposal[];
  contracts: ContractSummary[];
  addProposal: (draft: ProposalDraft) => Proposal;
  updateProposal: (proposalId: string, updates: Partial<Proposal>) => void;
  setProposalServices: (proposalId: string, services: Proposal["services"]) => void;
  setProposalSchedule: (proposalId: string, schedule: Proposal["schedule"]) => void;
  setProposalMilestones: (proposalId: string, milestones: Proposal["milestones"]) => void;
  setProposalPaymentPlan: (proposalId: string, paymentPlan: Proposal["paymentPlan"]) => void;
  setProposalApproval: (proposalId: string, approval: Proposal["approval"]) => void;
  addContract: (contract: ContractSummary) => ContractSummary;
  convertProposalToContract: (
    proposalId: string,
    overrides?: Partial<ContractSummary>
  ) => ContractSummary | null;
}

const SalesStoreContext = createContext<SalesStoreValue | null>(null);

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

function ensureProposal(draft: ProposalDraft): Proposal {
  const createdAt = draft.createdAt ?? new Date().toISOString().slice(0, 10);
  return {
    ...draft,
    id: draft.id ?? generateId("prop"),
    createdAt,
  };
}

function ensureContract(contract: ContractSummary): ContractSummary {
  return {
    ...contract,
    id: contract.id ?? generateId("contract"),
  };
}

export function SalesStoreProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>(() => [...proposalMocks]);
  const [contracts, setContracts] = useState<ContractSummary[]>(() => [...contractMocks]);

  const addProposal = useCallback((draft: ProposalDraft) => {
    const proposal = ensureProposal(draft);
    setProposals((previous) => [proposal, ...previous]);
    return proposal;
  }, []);

  const updateProposal = useCallback((proposalId: string, updates: Partial<Proposal>) => {
    setProposals((previous) =>
      previous.map((proposal) =>
        proposal.id === proposalId ? { ...proposal, ...updates } : proposal
      )
    );
  }, []);

  const setProposalServices = useCallback(
    (proposalId: string, services: Proposal["services"]) => {
      updateProposal(proposalId, { services });
    },
    [updateProposal]
  );

  const setProposalSchedule = useCallback(
    (proposalId: string, schedule: Proposal["schedule"]) => {
      updateProposal(proposalId, { schedule });
    },
    [updateProposal]
  );

  const setProposalMilestones = useCallback(
    (proposalId: string, milestones: Proposal["milestones"]) => {
      updateProposal(proposalId, { milestones });
    },
    [updateProposal]
  );

  const setProposalPaymentPlan = useCallback(
    (proposalId: string, paymentPlan: Proposal["paymentPlan"]) => {
      updateProposal(proposalId, { paymentPlan });
    },
    [updateProposal]
  );

  const setProposalApproval = useCallback(
    (proposalId: string, approval: Proposal["approval"]) => {
      updateProposal(proposalId, { approval });
    },
    [updateProposal]
  );

  const addContract = useCallback((contract: ContractSummary) => {
    const normalized = ensureContract(contract);
    setContracts((previous) => [normalized, ...previous]);
    return normalized;
  }, []);

  const convertProposalToContract = useCallback(
    (proposalId: string, overrides?: Partial<ContractSummary>) => {
      const proposal = proposals.find((item) => item.id === proposalId);

      if (!proposal) {
        return null;
      }

      const existingContract = contracts.find((item) => item.propostaId === proposalId);

      const contractBase: ContractSummary = existingContract ?? {
        id: overrides?.id ?? generateId("contract"),
        codigo:
          overrides?.codigo ?? `CT-${Math.floor(100 + Math.random() * 900)}`,
        cliente: overrides?.cliente ?? proposal.client,
        vigencia:
          overrides?.vigencia ??
          `${proposal.schedule.kickoff.slice(0, 4)}-${proposal.schedule.deadline.slice(0, 4)}`,
        status: overrides?.status ?? "Ativo",
        valorTotal: overrides?.valorTotal ?? proposal.paymentPlan.totalValue,
        propostaId: proposalId,
      };

      const nextContract = { ...contractBase, ...overrides, propostaId: proposalId };

      setContracts((previous) => {
        if (existingContract) {
          return previous.map((item) =>
            item.propostaId === proposalId ? { ...existingContract, ...nextContract } : item
          );
        }

        return [nextContract, ...previous];
      });

      setProposals((previous) =>
        previous.map((item) =>
          item.id === proposalId
            ? { ...item, status: "Aprovado", linkedContractId: nextContract.id }
            : item
        )
      );

      return nextContract;
    },
    [contracts, proposals]
  );

  const value = useMemo(
    () => ({
      proposals,
      contracts,
      addProposal,
      updateProposal,
      setProposalServices,
      setProposalSchedule,
      setProposalMilestones,
      setProposalPaymentPlan,
      setProposalApproval,
      addContract,
      convertProposalToContract,
    }),
    [
      proposals,
      contracts,
      addProposal,
      updateProposal,
      setProposalServices,
      setProposalSchedule,
      setProposalMilestones,
      setProposalPaymentPlan,
      setProposalApproval,
      addContract,
      convertProposalToContract,
    ]
  );

  return <SalesStoreContext.Provider value={value}>{children}</SalesStoreContext.Provider>;
}

export function useSalesStore() {
  const context = useContext(SalesStoreContext);

  if (!context) {
    throw new Error("useSalesStore deve ser utilizado dentro de SalesStoreProvider");
  }

  return context;
}
