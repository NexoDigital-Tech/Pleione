"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { Contract } from "./data";
import { contractsDetailedMock } from "./data";

type ContractSectionKey = "docConfig" | "terms" | "billing" | "team" | "signature" | "financialSummary" | "highlights";

type ContractsStoreValue = {
  contracts: Contract[];
  selectedContract: Contract | null;
  selectContract: (contractId: string) => void;
  createContract: (contract: Contract) => void;
  updateContract: (contractId: string, data: Partial<Contract>) => void;
  updateContractSection: <K extends ContractSectionKey>(
    contractId: string,
    section: K,
    data: Contract[K],
  ) => void;
};

const ContractsContext = createContext<ContractsStoreValue | undefined>(undefined);

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>(contractsDetailedMock);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(
    contractsDetailedMock[0]?.id ?? null,
  );

  const selectContract = useCallback((contractId: string) => {
    setSelectedContractId(contractId);
  }, []);

  const createContract = useCallback((contract: Contract) => {
    setContracts((previous) => [contract, ...previous]);
    setSelectedContractId(contract.id);
  }, []);

  const updateContract = useCallback((contractId: string, data: Partial<Contract>) => {
    setContracts((previous) =>
      previous.map((contract) => (contract.id === contractId ? { ...contract, ...data } : contract)),
    );
  }, []);

  const updateContractSection = useCallback(
    <K extends ContractSectionKey>(contractId: string, section: K, data: Contract[K]) => {
      setContracts((previous) =>
        previous.map((contract) =>
          contract.id === contractId ? { ...contract, [section]: data } : contract,
        ),
      );
    },
    [],
  );

  const value = useMemo<ContractsStoreValue>(() => {
    const selectedContract = contracts.find((contract) => contract.id === selectedContractId) ?? null;

    return {
      contracts,
      selectedContract,
      selectContract,
      createContract,
      updateContract,
      updateContractSection,
    };
  }, [contracts, selectedContractId, selectContract, createContract, updateContract, updateContractSection]);

  return <ContractsContext.Provider value={value}>{children}</ContractsContext.Provider>;
}

export function useContractsStore() {
  const context = useContext(ContractsContext);

  if (!context) {
    throw new Error("useContractsStore deve ser utilizado dentro de ContractsProvider");
  }

  return context;
}
