import { useCallback, useMemo, useState } from "react";

import { clientesMock } from "../_mocks/data";

export type EnterpriseLocation = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  referencePoints?: string;
  area?: string;
};

export type EnterpriseFeature = {
  id: string;
  label: string;
  description?: string;
};

export type EnterpriseEnvProfile = {
  classification: "Baixo" | "Moderado" | "Alto";
  waterUsage: string;
  energyMatrix: string;
  wastePlan: string;
  notes?: string;
};

export type EnterpriseFlags = {
  environmentalCompliance: boolean;
  socialCompliance: boolean;
  safetyCompliance: boolean;
  hasPendingNotifications: boolean;
  notes?: string;
};

export type EnterpriseLicence = {
  id: string;
  catalogId: string;
  name: string;
  issuer: string;
  category: string;
  status: "Ativa" | "Em renovação" | "Expirada";
  validUntil: string;
};

export type EnterpriseDocument = {
  id: string;
  name: string;
  category: string;
  uploadedAt: string;
  owner: string;
};

export type Enterprise = {
  id: string;
  name: string;
  code: string;
  description: string;
  phase: string;
  status: string;
  clientId: string;
  contactId?: string;
  manager: string;
  startDate: string;
  progress: number;
  location: EnterpriseLocation;
  features: EnterpriseFeature[];
  envProfile: EnterpriseEnvProfile;
  flags: EnterpriseFlags;
  licences: EnterpriseLicence[];
  documents: EnterpriseDocument[];
  complianceScore: number;
};

export type EnterpriseDraft = Omit<Enterprise, "id">;

export type EnterpriseClient = {
  id: string;
  name: string;
  segment: string;
};

export type EnterpriseContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  clientId: string;
};

export type EnterpriseLicenceTemplate = {
  id: string;
  name: string;
  issuer: string;
  category: string;
  description: string;
  defaultValidityMonths: number;
};

export const ENTERPRISE_PHASES = [
  "Estudo de viabilidade",
  "Licenciamento",
  "Implantação",
  "Operação",
] as const;

export const ENTERPRISE_STATUSES = [
  "Conforme",
  "Pendências",
  "Monitoramento",
  "Suspenso",
] as const;

export const ENTERPRISE_FEATURE_LIBRARY: EnterpriseFeature[] = [
  {
    id: "residential-complex",
    label: "Condomínio residencial",
    description: "Edificações voltadas a uso residencial multifamiliar",
  },
  {
    id: "commercial-mix",
    label: "Uso misto",
    description: "Áreas comerciais integradas ao empreendimento",
  },
  {
    id: "solar-energy",
    label: "Geração fotovoltaica",
    description: "Placas solares para atendimento parcial da demanda",
  },
  {
    id: "water-reuse",
    label: "Reuso de água",
    description: "Sistema de reaproveitamento de águas cinzas",
  },
  {
    id: "waste-management",
    label: "Gestão de resíduos",
    description: "Central de triagem e armazenamento de resíduos",
  },
];

export const ENTERPRISE_LICENCE_CATALOG: EnterpriseLicenceTemplate[] = [
  {
    id: "lic-ambiental",
    name: "Licença Ambiental de Operação",
    issuer: "Secretaria Estadual de Meio Ambiente",
    category: "Ambiental",
    description: "Autoriza a operação em conformidade ambiental",
    defaultValidityMonths: 24,
  },
  {
    id: "lic-corpo-de-bombeiros",
    name: "Certificado do Corpo de Bombeiros",
    issuer: "Corpo de Bombeiros Estadual",
    category: "Segurança",
    description: "Comprova atendimento às normas de segurança contra incêndio",
    defaultValidityMonths: 12,
  },
  {
    id: "lic-vigilancia",
    name: "Alvará da Vigilância Sanitária",
    issuer: "Secretaria Municipal de Saúde",
    category: "Sanitário",
    description: "Autoriza o funcionamento em conformidade sanitária",
    defaultValidityMonths: 12,
  },
];

export const ENTERPRISE_CLIENTS: EnterpriseClient[] = clientesMock.map((cliente, index) => ({
  id: `cliente-${index}`,
  name: cliente.nome,
  segment: cliente.segmento,
}));

export const ENTERPRISE_CONTACTS: EnterpriseContact[] = [
  {
    id: "contact-ana-souza",
    name: "Ana Souza",
    email: "ana.souza@horizonte.com",
    phone: "+55 11 99999-1020",
    role: "Gerente de projetos",
    clientId: "cliente-0",
  },
  {
    id: "contact-pedro-lima",
    name: "Pedro Lima",
    email: "pedro.lima@aurora.com",
    phone: "+55 41 98888-1234",
    role: "Coordenador técnico",
    clientId: "cliente-1",
  },
  {
    id: "contact-marina-alves",
    name: "Marina Alves",
    email: "marina.alves@atlantica.com",
    phone: "+55 51 97777-4567",
    role: "Diretora de operações",
    clientId: "cliente-2",
  },
].filter((contact) => ENTERPRISE_CLIENTS.some((client) => client.id === contact.clientId));

const CLIENT_MAP = new Map(ENTERPRISE_CLIENTS.map((client) => [client.id, client]));
const CONTACT_MAP = new Map(ENTERPRISE_CONTACTS.map((contact) => [contact.id, contact]));

export const ENTERPRISES_MOCK: Enterprise[] = [
  {
    id: "emp-parque-das-flores",
    name: "Parque das Flores",
    code: "EMP-204",
    description: "Residencial vertical com foco em sustentabilidade e áreas verdes compartilhadas.",
    phase: "Implantação",
    status: "Conforme",
    clientId: "cliente-0",
    contactId: "contact-ana-souza",
    manager: "Equipe Engenharia",
    startDate: "2024-02-01",
    progress: 58,
    location: {
      address: "Rua das Cerejeiras, 145",
      city: "Curitiba",
      state: "PR",
      country: "Brasil",
      postalCode: "80045-120",
      latitude: -25.4284,
      longitude: -49.2733,
      referencePoints: "Próximo ao Parque Barigui",
      area: "38.000 m²",
    },
    features: [
      ENTERPRISE_FEATURE_LIBRARY[0],
      ENTERPRISE_FEATURE_LIBRARY[2],
      ENTERPRISE_FEATURE_LIBRARY[3],
    ],
    envProfile: {
      classification: "Moderado",
      waterUsage: "Sistema de reuso em operação",
      energyMatrix: "Painéis solares e rede pública",
      wastePlan: "Plano de resíduos segregado por tipologia",
      notes: "Monitoramento trimestral em andamento.",
    },
    flags: {
      environmentalCompliance: true,
      socialCompliance: true,
      safetyCompliance: true,
      hasPendingNotifications: false,
      notes: "",
    },
    licences: [
      {
        id: "lic-ambiental-parque-flores",
        catalogId: "lic-ambiental",
        name: "Licença Ambiental de Operação",
        issuer: "Secretaria Estadual de Meio Ambiente",
        category: "Ambiental",
        status: "Ativa",
        validUntil: "2025-12-31",
      },
      {
        id: "lic-bombeiros-parque-flores",
        catalogId: "lic-corpo-de-bombeiros",
        name: "Certificado do Corpo de Bombeiros",
        issuer: "Corpo de Bombeiros Estadual",
        category: "Segurança",
        status: "Em renovação",
        validUntil: "2024-08-10",
      },
    ],
    documents: [
      {
        id: "doc-memorial-parque-flores",
        name: "Memorial descritivo",
        category: "Projeto",
        uploadedAt: "2024-03-12",
        owner: "Ana Souza",
      },
      {
        id: "doc-relatorio-auditoria-parque-flores",
        name: "Relatório de auditoria Q1",
        category: "Compliance",
        uploadedAt: "2024-04-05",
        owner: "Equipe Engenharia",
      },
    ],
    complianceScore: 86,
  },
  {
    id: "emp-vila-verde",
    name: "Vila Verde",
    code: "EMP-198",
    description: "Condomínio horizontal com foco em eficiência energética e mobilidade compartilhada.",
    phase: "Licenciamento",
    status: "Pendências",
    clientId: "cliente-1",
    contactId: "contact-pedro-lima",
    manager: "Time Urbanismo",
    startDate: "2023-11-15",
    progress: 32,
    location: {
      address: "Rodovia LMG-800, Km 12",
      city: "Belo Horizonte",
      state: "MG",
      country: "Brasil",
      postalCode: "33100-000",
      latitude: -19.9167,
      longitude: -43.9345,
      referencePoints: "Próximo ao Aeroporto Internacional",
      area: "54.500 m²",
    },
    features: [ENTERPRISE_FEATURE_LIBRARY[1], ENTERPRISE_FEATURE_LIBRARY[3]],
    envProfile: {
      classification: "Alto",
      waterUsage: "Estudos de reuso em aprovação",
      energyMatrix: "Rede pública com estudo fotovoltaico",
      wastePlan: "Plano preliminar apresentado",
      notes: "Pendência de parecer ambiental estadual.",
    },
    flags: {
      environmentalCompliance: false,
      socialCompliance: true,
      safetyCompliance: true,
      hasPendingNotifications: true,
      notes: "Aguardando licença ambiental prévia.",
    },
    licences: [
      {
        id: "lic-vigilancia-vila-verde",
        catalogId: "lic-vigilancia",
        name: "Alvará da Vigilância Sanitária",
        issuer: "Secretaria Municipal de Saúde",
        category: "Sanitário",
        status: "Em renovação",
        validUntil: "2024-06-20",
      },
    ],
    documents: [
      {
        id: "doc-relatorio-impacto-vila-verde",
        name: "Relatório de impacto ambiental",
        category: "Ambiental",
        uploadedAt: "2024-02-27",
        owner: "José Miranda",
      },
    ],
    complianceScore: 62,
  },
  {
    id: "emp-jardins-do-sol",
    name: "Jardins do Sol",
    code: "EMP-205",
    description: "Complexo multiuso com torres comerciais e residenciais integradas.",
    phase: "Operação",
    status: "Monitoramento",
    clientId: "cliente-2",
    contactId: "contact-marina-alves",
    manager: "Equipe Facilities",
    startDate: "2022-09-01",
    progress: 88,
    location: {
      address: "Av. Paulista, 1578",
      city: "São Paulo",
      state: "SP",
      country: "Brasil",
      postalCode: "01310-200",
      latitude: -23.5614,
      longitude: -46.6559,
      referencePoints: "Ao lado da estação Trianon",
      area: "72.000 m²",
    },
    features: [
      ENTERPRISE_FEATURE_LIBRARY[0],
      ENTERPRISE_FEATURE_LIBRARY[1],
      ENTERPRISE_FEATURE_LIBRARY[2],
      ENTERPRISE_FEATURE_LIBRARY[4],
    ],
    envProfile: {
      classification: "Moderado",
      waterUsage: "Sistema de reuso e captação de chuva",
      energyMatrix: "Solar e cogeração",
      wastePlan: "Coleta seletiva com cooperativas",
      notes: "Monitoramento de emissões atmosféricas trimestral.",
    },
    flags: {
      environmentalCompliance: true,
      socialCompliance: true,
      safetyCompliance: false,
      hasPendingNotifications: true,
      notes: "Revisão do plano de emergência em andamento.",
    },
    licences: [
      {
        id: "lic-ambiental-jardins-sol",
        catalogId: "lic-ambiental",
        name: "Licença Ambiental de Operação",
        issuer: "Secretaria Estadual de Meio Ambiente",
        category: "Ambiental",
        status: "Ativa",
        validUntil: "2026-03-18",
      },
      {
        id: "lic-bombeiros-jardins-sol",
        catalogId: "lic-corpo-de-bombeiros",
        name: "Certificado do Corpo de Bombeiros",
        issuer: "Corpo de Bombeiros Estadual",
        category: "Segurança",
        status: "Ativa",
        validUntil: "2025-11-01",
      },
    ],
    documents: [
      {
        id: "doc-plano-manutencao-jardins-sol",
        name: "Plano de manutenção 2024",
        category: "Operação",
        uploadedAt: "2024-01-09",
        owner: "Equipe Facilities",
      },
      {
        id: "doc-relatorio-seguranca-jardins-sol",
        name: "Checklist de segurança trimestral",
        category: "Segurança",
        uploadedAt: "2024-04-02",
        owner: "Marina Alves",
      },
    ],
    complianceScore: 78,
  },
];

export const ENTERPRISE_STATUS_SET = new Set(ENTERPRISE_STATUSES);
export const ENTERPRISE_PHASE_SET = new Set(ENTERPRISE_PHASES);

export function getClientById(clientId: string) {
  return CLIENT_MAP.get(clientId);
}

export function getContactById(contactId?: string) {
  if (!contactId) return undefined;
  return CONTACT_MAP.get(contactId);
}

export function generateEnterpriseId() {
  return `emp-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyEnterpriseDraft(): EnterpriseDraft {
  return {
    name: "",
    code: "",
    description: "",
    phase: ENTERPRISE_PHASES[0],
    status: ENTERPRISE_STATUSES[0],
    clientId: ENTERPRISE_CLIENTS[0]?.id ?? "",
    contactId: undefined,
    manager: "",
    startDate: "",
    progress: 0,
    location: {
      address: "",
      city: "",
      state: "",
      country: "Brasil",
      postalCode: "",
      latitude: undefined,
      longitude: undefined,
      referencePoints: "",
      area: "",
    },
    features: [],
    envProfile: {
      classification: "Moderado",
      waterUsage: "",
      energyMatrix: "",
      wastePlan: "",
      notes: "",
    },
    flags: {
      environmentalCompliance: true,
      socialCompliance: true,
      safetyCompliance: true,
      hasPendingNotifications: false,
      notes: "",
    },
    licences: [],
    documents: [],
    complianceScore: 70,
  };
}

export function createEnterpriseFromDraft(draft: EnterpriseDraft): Enterprise {
  return {
    ...draft,
    id: generateEnterpriseId(),
  };
}

export function useEnterpriseStore(initialEnterprises: Enterprise[] = ENTERPRISES_MOCK) {
  const [enterprises, setEnterprises] = useState<Enterprise[]>(initialEnterprises);

  const addEnterprise = useCallback((enterprise: Enterprise) => {
    setEnterprises((previous) => [enterprise, ...previous]);
  }, []);

  const updateEnterprise = useCallback((enterpriseId: string, payload: Partial<Enterprise>) => {
    setEnterprises((previous) =>
      previous.map((item) => (item.id === enterpriseId ? { ...item, ...payload } : item))
    );
  }, []);

  const catalogueById = useMemo(
    () => new Map(ENTERPRISE_LICENCE_CATALOG.map((item) => [item.id, item])),
    []
  );

  return {
    enterprises,
    addEnterprise,
    updateEnterprise,
    catalogueById,
  } as const;
}

