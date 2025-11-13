export type CurrencyCode = "BRL";

export interface ProposalSchedulePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  owner?: string;
}

export interface ProposalSchedule {
  kickoff: string;
  deadline: string;
  phases: ProposalSchedulePhase[];
  notes?: string;
}

export type MilestoneStatus = "pending" | "completed" | "delayed";

export interface ProposalMilestone {
  id: string;
  title: string;
  expectedDate: string;
  status: MilestoneStatus;
  responsible: string;
  description?: string;
}

export interface ProposalService {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  billingType: "Único" | "Mensal";
}

export interface ProposalPaymentDetail {
  method: string;
  accepted: boolean;
  notes?: string;
}

export type InstallmentStatus = "pending" | "paid" | "overdue";

export interface ProposalPaymentInstallment {
  id: string;
  sequence: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  method: string;
}

export interface ProposalPaymentPlan {
  totalValue: number;
  currency: CurrencyCode;
  upfrontPercentage: number;
  interestRate: number;
  installments: ProposalPaymentInstallment[];
  acceptedMethods: ProposalPaymentDetail[];
  penaltyPolicy?: string;
}

export interface ApprovalContact {
  name: string;
  role: string;
  email: string;
  phone: string;
}

export type ApprovalStepStatus = "pending" | "approved" | "rejected";

export interface ProposalApprovalStep {
  id: string;
  area: string;
  approver: string;
  status: ApprovalStepStatus;
  dueDate: string;
  notes?: string;
}

export interface ProposalApproval {
  flowName: string;
  steps: ProposalApprovalStep[];
  mainContact: ApprovalContact;
  observations?: string;
}

export type ProposalStatus =
  | "Rascunho"
  | "Em negociação"
  | "Enviado"
  | "Aprovado"
  | "Reprovado";

export interface Proposal {
  id: string;
  code: string;
  title: string;
  client: string;
  segment: string;
  createdAt: string;
  status: ProposalStatus;
  probability: number;
  schedule: ProposalSchedule;
  milestones: ProposalMilestone[];
  services: ProposalService[];
  paymentPlan: ProposalPaymentPlan;
  approval: ProposalApproval;
  notes?: string;
  linkedContractId?: string;
}

export type ProposalDraft = Omit<Proposal, "id" | "createdAt" | "linkedContractId"> & {
  id?: string;
  createdAt?: string;
};

export interface ProposalServiceTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultUnitPrice: number;
  billingType: "Único" | "Mensal";
}

export interface ContractSummary {
  id: string;
  codigo: string;
  cliente: string;
  vigencia: string;
  status: string;
  valorTotal: number;
  propostaId?: string;
}

const serviceTemplates: ProposalServiceTemplate[] = [
  {
    id: "svc-implantacao-crm",
    name: "Implantação de CRM",
    category: "Tecnologia",
    description: "Configuração inicial, migração de dados e treinamentos da ferramenta CRM.",
    defaultUnitPrice: 68000,
    billingType: "Único",
  },
  {
    id: "svc-viabilidade",
    name: "Estudo de viabilidade",
    category: "Consultoria",
    description: "Análise econômico-financeira para novos empreendimentos imobiliários.",
    defaultUnitPrice: 24000,
    billingType: "Único",
  },
  {
    id: "svc-capacitacao",
    name: "Capacitação comercial",
    category: "Treinamentos",
    description: "Programa de treinamento intensivo para equipes de vendas e pré-vendas.",
    defaultUnitPrice: 8500,
    billingType: "Mensal",
  },
  {
    id: "svc-go-to-market",
    name: "Plano Go-to-Market",
    category: "Estratégia",
    description: "Planejamento de lançamento com definição de canais, messaging e metas.",
    defaultUnitPrice: 31000,
    billingType: "Único",
  },
];

export const proposalServiceCatalog = serviceTemplates;

export const proposalMocks: Proposal[] = [
  {
    id: "prop-aurora",
    code: "PR-2045",
    title: "Implantação CRM Aurora",
    client: "Residencial Aurora",
    segment: "Condomínios",
    createdAt: "2024-01-15",
    status: "Em negociação",
    probability: 0.65,
    schedule: {
      kickoff: "2024-02-01",
      deadline: "2024-07-30",
      phases: [
        {
          id: "fase-descoberta",
          name: "Descoberta",
          startDate: "2024-02-01",
          endDate: "2024-02-29",
          progress: 85,
          owner: "Equipe Comercial",
        },
        {
          id: "fase-implantacao",
          name: "Implantação",
          startDate: "2024-03-01",
          endDate: "2024-05-15",
          progress: 60,
          owner: "Sucesso do Cliente",
        },
        {
          id: "fase-treinamento",
          name: "Treinamentos",
          startDate: "2024-05-16",
          endDate: "2024-06-30",
          progress: 20,
          owner: "Academia Comercial",
        },
      ],
    },
    milestones: [
      {
        id: "ms-workshop",
        title: "Workshop de Kickoff",
        expectedDate: "2024-02-05",
        status: "completed",
        responsible: "Marina Pires",
        description: "Reunião inicial com diretoria e equipe operacional.",
      },
      {
        id: "ms-go-live",
        title: "Go-live do CRM",
        expectedDate: "2024-05-20",
        status: "pending",
        responsible: "Henrique Gomes",
        description: "Primeira onda de usuários ativos na plataforma.",
      },
      {
        id: "ms-adesao",
        title: "Adesão mínima atingida",
        expectedDate: "2024-06-30",
        status: "pending",
        responsible: "Equipe de CS",
      },
    ],
    services: [
      {
        id: "svc-implantacao-crm",
        name: "Implantação de CRM",
        category: "Tecnologia",
        description: "Equipe dedicada para parametrização e integrações.",
        quantity: 1,
        unitPrice: 72000,
        billingType: "Único",
      },
      {
        id: "svc-capacitacao",
        name: "Capacitação comercial",
        category: "Treinamentos",
        description: "Turmas quinzenais com conteúdos personalizados.",
        quantity: 4,
        unitPrice: 9000,
        billingType: "Mensal",
      },
    ],
    paymentPlan: {
      totalValue: 108000,
      currency: "BRL",
      upfrontPercentage: 20,
      interestRate: 0,
      installments: [
        {
          id: "in-aurora-1",
          sequence: 1,
          dueDate: "2024-02-10",
          amount: 21600,
          status: "paid",
          method: "Pix",
        },
        {
          id: "in-aurora-2",
          sequence: 2,
          dueDate: "2024-04-10",
          amount: 43200,
          status: "pending",
          method: "Boleto",
        },
        {
          id: "in-aurora-3",
          sequence: 3,
          dueDate: "2024-06-10",
          amount: 43200,
          status: "pending",
          method: "Boleto",
        },
      ],
      acceptedMethods: [
        { method: "Pix", accepted: true },
        { method: "Boleto", accepted: true, notes: "Prazo de 15 dias para compensação" },
        { method: "Cartão corporativo", accepted: false },
      ],
      penaltyPolicy: "Multa de 2% e juros de 1% a.m. para parcelas atrasadas.",
    },
    approval: {
      flowName: "Fluxo Aurora",
      steps: [
        {
          id: "aprov-financeiro",
          area: "Financeiro",
          approver: "Patrícia Reis",
          status: "approved",
          dueDate: "2024-01-25",
          notes: "Aguardando apenas negociação de parcelamento.",
        },
        {
          id: "aprov-juridico",
          area: "Jurídico",
          approver: "Dr. Marcelo Vilar",
          status: "pending",
          dueDate: "2024-02-02",
        },
      ],
      mainContact: {
        name: "Lucas Andrade",
        role: "Gerente de Operações",
        email: "lucas.andrade@residencialaurora.com",
        phone: "+55 41 99999-1234",
      },
      observations: "Enviar minuta revisada com cláusula de confidencialidade ampliada.",
    },
    notes: "Proposta prioritária para Q1, envolve integração com ERP proprietário.",
  },
  {
    id: "prop-horizonte",
    code: "PR-2042",
    title: "Programa de eficiência comercial",
    client: "Construtora Horizonte",
    segment: "Incorporação",
    createdAt: "2023-12-11",
    status: "Enviado",
    probability: 0.55,
    schedule: {
      kickoff: "2024-03-05",
      deadline: "2024-09-10",
      phases: [
        {
          id: "fase-diagnostico",
          name: "Diagnóstico",
          startDate: "2024-03-05",
          endDate: "2024-04-04",
          progress: 50,
        },
        {
          id: "fase-implementacao",
          name: "Implementação",
          startDate: "2024-04-05",
          endDate: "2024-07-15",
          progress: 35,
        },
        {
          id: "fase-monitoramento",
          name: "Monitoramento",
          startDate: "2024-07-16",
          endDate: "2024-09-10",
          progress: 10,
        },
      ],
    },
    milestones: [
      {
        id: "ms-diagnostico",
        title: "Relatório de diagnóstico",
        expectedDate: "2024-04-04",
        status: "pending",
        responsible: "Gabriela Nunes",
      },
      {
        id: "ms-piloto",
        title: "Piloto com regional Sul",
        expectedDate: "2024-06-12",
        status: "pending",
        responsible: "Equipe Comercial",
      },
    ],
    services: [
      {
        id: "svc-viabilidade",
        name: "Estudo de viabilidade",
        category: "Consultoria",
        description: "Avaliação financeira de carteira ativa e novos lançamentos.",
        quantity: 1,
        unitPrice: 26000,
        billingType: "Único",
      },
      {
        id: "svc-go-to-market",
        name: "Plano Go-to-Market",
        category: "Estratégia",
        description: "Reposicionamento comercial com metas e canais.",
        quantity: 1,
        unitPrice: 32000,
        billingType: "Único",
      },
      {
        id: "svc-capacitacao",
        name: "Capacitação comercial",
        category: "Treinamentos",
        description: "Treinamentos mensais para três turmas.",
        quantity: 6,
        unitPrice: 8700,
        billingType: "Mensal",
      },
    ],
    paymentPlan: {
      totalValue: 111200,
      currency: "BRL",
      upfrontPercentage: 15,
      interestRate: 0.9,
      installments: [
        {
          id: "in-horizonte-1",
          sequence: 1,
          dueDate: "2024-03-20",
          amount: 16680,
          status: "pending",
          method: "Pix",
        },
        {
          id: "in-horizonte-2",
          sequence: 2,
          dueDate: "2024-05-20",
          amount: 37000,
          status: "pending",
          method: "Boleto",
        },
        {
          id: "in-horizonte-3",
          sequence: 3,
          dueDate: "2024-07-20",
          amount: 37000,
          status: "pending",
          method: "Boleto",
        },
        {
          id: "in-horizonte-4",
          sequence: 4,
          dueDate: "2024-09-20",
          amount: 20480,
          status: "pending",
          method: "Cartão corporativo",
        },
      ],
      acceptedMethods: [
        { method: "Pix", accepted: true },
        { method: "Boleto", accepted: true },
        { method: "Cartão corporativo", accepted: true, notes: "Parcelamento em até 4x" },
      ],
      penaltyPolicy: "Reajuste IPCA + 1,2% a.a. e multa de 2% para cancelamentos.",
    },
    approval: {
      flowName: "Governança Horizonte",
      steps: [
        {
          id: "aprov-cfo",
          area: "Diretoria Financeira",
          approver: "CFO - Elisa Matos",
          status: "approved",
          dueDate: "2024-01-05",
        },
        {
          id: "aprov-ceo",
          area: "Diretoria Executiva",
          approver: "CEO - Jorge Paiva",
          status: "pending",
          dueDate: "2024-02-15",
        },
      ],
      mainContact: {
        name: "Paulo Stein",
        role: "Gerente Comercial",
        email: "paulo.stein@construtorahorizonte.com",
        phone: "+55 11 98888-7777",
      },
      observations: "Enviar apresentação financeira consolidada para diretoria executiva.",
    },
  },
  {
    id: "prop-atlantica",
    code: "PR-2039",
    title: "Portal do cliente corporativo",
    client: "Grupo Atlântica",
    segment: "Comercial",
    createdAt: "2023-11-20",
    status: "Rascunho",
    probability: 0.4,
    schedule: {
      kickoff: "2024-04-01",
      deadline: "2024-10-30",
      phases: [
        {
          id: "fase-design",
          name: "Design e UX",
          startDate: "2024-04-01",
          endDate: "2024-05-30",
          progress: 15,
        },
        {
          id: "fase-desenvolvimento",
          name: "Desenvolvimento",
          startDate: "2024-06-01",
          endDate: "2024-09-20",
          progress: 0,
        },
        {
          id: "fase-lancamento",
          name: "Lançamento",
          startDate: "2024-09-21",
          endDate: "2024-10-30",
          progress: 0,
        },
      ],
    },
    milestones: [
      {
        id: "ms-wireframes",
        title: "Wireframes aprovados",
        expectedDate: "2024-05-15",
        status: "pending",
        responsible: "Time de Produto",
      },
      {
        id: "ms-prototipo",
        title: "Protótipo navegável",
        expectedDate: "2024-06-30",
        status: "pending",
        responsible: "UX Research",
      },
    ],
    services: [
      {
        id: "svc-go-to-market",
        name: "Plano Go-to-Market",
        category: "Estratégia",
        description: "Plano completo para lançamento do portal B2B.",
        quantity: 1,
        unitPrice: 33000,
        billingType: "Único",
      },
      {
        id: "svc-implantacao-crm",
        name: "Implantação de CRM",
        category: "Tecnologia",
        description: "Integração portal com CRM e ERP.",
        quantity: 1,
        unitPrice: 75000,
        billingType: "Único",
      },
    ],
    paymentPlan: {
      totalValue: 108000,
      currency: "BRL",
      upfrontPercentage: 10,
      interestRate: 1.2,
      installments: [
        {
          id: "in-atlantica-1",
          sequence: 1,
          dueDate: "2024-04-05",
          amount: 10800,
          status: "pending",
          method: "Pix",
        },
        {
          id: "in-atlantica-2",
          sequence: 2,
          dueDate: "2024-06-05",
          amount: 36000,
          status: "pending",
          method: "Boleto",
        },
        {
          id: "in-atlantica-3",
          sequence: 3,
          dueDate: "2024-08-05",
          amount: 36000,
          status: "pending",
          method: "Boleto",
        },
        {
          id: "in-atlantica-4",
          sequence: 4,
          dueDate: "2024-10-05",
          amount: 25200,
          status: "pending",
          method: "Cartão corporativo",
        },
      ],
      acceptedMethods: [
        { method: "Pix", accepted: true },
        { method: "Boleto", accepted: true },
        { method: "Cartão corporativo", accepted: true },
      ],
      penaltyPolicy: "Multa de 1% a.m. e correção pelo CDI.",
    },
    approval: {
      flowName: "Fluxo Atlântica",
      steps: [
        {
          id: "aprov-compras",
          area: "Compras",
          approver: "Laura Siqueira",
          status: "pending",
          dueDate: "2024-03-10",
        },
        {
          id: "aprov-ti",
          area: "TI",
          approver: "Rodrigo Mota",
          status: "pending",
          dueDate: "2024-03-20",
        },
      ],
      mainContact: {
        name: "Rafael Costa",
        role: "Diretor de Operações",
        email: "rafael.costa@grupoatlantica.com",
        phone: "+55 21 97777-0000",
      },
    },
  },
];

export const contractMocks: ContractSummary[] = [
  {
    id: "contrato-aurora",
    codigo: "CT-901",
    cliente: "Residencial Aurora",
    vigencia: "2024-2026",
    status: "Ativo",
    valorTotal: 820000,
    propostaId: "prop-aurora",
  },
  {
    id: "contrato-atlantica",
    codigo: "CT-894",
    cliente: "Grupo Atlântica",
    vigencia: "2024-2025",
    status: "Revisão",
    valorTotal: 540000,
  },
  {
    id: "contrato-vila-verde",
    codigo: "CT-887",
    cliente: "Vila Verde",
    vigencia: "2023-2026",
    status: "Ativo",
    valorTotal: 390000,
  },
];
