import { clientesMock, empreendimentosMock, propostasMock } from "../_mocks/data";

export type ContractStatus = "Rascunho" | "Em revisão" | "Em assinatura" | "Assinado" | "Encerrado";

export type ContractDocConfig = {
  templateId: string;
  templateName: string;
  version: string;
  signaturePlatform: "Clicksign" | "DocuSign" | "Portal interno";
  requiresWitness: boolean;
  sendForLegalReview: boolean;
  autoReminders: boolean;
  lastUpdated: string;
  attachmentUrls: string[];
};

export type ContractTerms = {
  startDate: string;
  endDate: string;
  renewal: "Automática" | "Sob demanda" | "Sem renovação";
  responsibilities: string[];
  guarantees: string[];
  keyClauses: string[];
  noticePeriodDays: number;
};

export type ContractBilling = {
  totalValue: number;
  currency: "BRL";
  billingCycle: "Mensal" | "Trimestral" | "Por marco";
  taxes: { name: string; rate: number }[];
  paymentConditions: string[];
  discountPolicy?: string;
};

export type ContractTeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  company: string;
  type: "Interno" | "Cliente";
};

export type ContractTeam = {
  mode: "Híbrido" | "Remoto" | "Presencial";
  owner: ContractTeamMember;
  members: ContractTeamMember[];
  communicationChannel: string;
};

export type ContractSignature = {
  status: "Pendente" | "Parcial" | "Concluída";
  pendingSigners: string[];
  lastSentAt: string;
  deadline: string;
};

export type Contract = {
  id: string;
  code: string;
  status: ContractStatus;
  client: (typeof clientesMock)[number] & {
    contatoPrincipal: { nome: string; email: string; telefone: string };
  };
  enterprise: (typeof empreendimentosMock)[number];
  proposal: (typeof propostasMock)[number];
  signature: ContractSignature;
  financialSummary: {
    totalValue: number;
    executedPercentage: number;
    outstandingAmount: number;
    nextInvoiceDate: string;
  };
  docConfig: ContractDocConfig;
  terms: ContractTerms;
  billing: ContractBilling;
  team: ContractTeam;
  highlights: string[];
};

const clientesDetalhados = clientesMock.map((cliente, index) => ({
  ...cliente,
  contatoPrincipal: {
    nome: ["Mariana Costa", "Henrique Prado", "Laura Martins"][index] ?? "Contato dedicado",
    email: ["mariana@aurora.com", "henrique@horizonte.com", "laura@atlantica.com"][index] ?? "contato@cliente.com",
    telefone: ["+55 41 98812-4455", "+55 11 97731-2301", "+55 21 98321-1188"][index] ?? "+55 11 90000-0000",
  },
}));

export const contractTeamDirectory: ContractTeamMember[] = [
  {
    id: "internal-1",
    name: "Ana Ribeiro",
    role: "Gerente de Contas",
    email: "ana.ribeiro@pleione.com",
    company: "Pleione",
    type: "Interno",
  },
  {
    id: "internal-2",
    name: "Carlos Menezes",
    role: "Coordenador Jurídico",
    email: "carlos.menezes@pleione.com",
    company: "Pleione",
    type: "Interno",
  },
  {
    id: "internal-3",
    name: "Fernanda Lopes",
    role: "Especialista Financeira",
    email: "fernanda.lopes@pleione.com",
    company: "Pleione",
    type: "Interno",
  },
  ...clientesDetalhados.map((cliente, index) => ({
    id: `client-${index + 1}`,
    name: cliente.contatoPrincipal.nome,
    role: "Representante do cliente",
    email: cliente.contatoPrincipal.email,
    company: cliente.name,
    type: "Cliente" as const,
  })),
];

const findTeamMember = (id: string) => contractTeamDirectory.find((member) => member.id === id)!;

export const contractsDetailedMock: Contract[] = [
  {
    id: "contract-aurora",
    code: "CT-901",
    status: "Em assinatura",
    client: clientesDetalhados[0],
    enterprise: empreendimentosMock[0],
    proposal: propostasMock[0],
    signature: {
      status: "Parcial",
      pendingSigners: [clientesDetalhados[0].contatoPrincipal.nome],
      lastSentAt: "2024-09-18T10:00:00-03:00",
      deadline: "2024-09-25",
    },
    financialSummary: {
      totalValue: 420_000,
      executedPercentage: 0.35,
      outstandingAmount: 273_000,
      nextInvoiceDate: "2024-10-05",
    },
    docConfig: {
      templateId: "tpl-urbanismo-2024",
      templateName: "Template padrão de urbanismo",
      version: "v3.2",
      signaturePlatform: "Clicksign",
      requiresWitness: true,
      sendForLegalReview: true,
      autoReminders: true,
      lastUpdated: "2024-08-12",
      attachmentUrls: ["https://files.pleione.com/checklist-aurora.pdf"],
    },
    terms: {
      startDate: "2024-09-01",
      endDate: "2026-08-31",
      renewal: "Automática",
      responsibilities: [
        "Implantar CRM Pleione para equipe comercial",
        "Disponibilizar treinamentos trimestrais",
      ],
      guarantees: [
        "Garantia de SLA de 99,5% para suporte",
        "Multa rescisória equivalente a 2 mensalidades",
      ],
      keyClauses: [
        "Revisão anual de escopo com 30 dias de antecedência",
        "Confidencialidade abrangendo parceiros e fornecedores",
      ],
      noticePeriodDays: 45,
    },
    billing: {
      totalValue: 420_000,
      currency: "BRL",
      billingCycle: "Mensal",
      taxes: [
        { name: "ISS", rate: 0.03 },
        { name: "PIS/COFINS", rate: 0.0365 },
      ],
      paymentConditions: [
        "Entrada de 10% após assinatura",
        "Saldo dividido em 24 parcelas iguais",
      ],
      discountPolicy: "Desconto de 5% para pagamento antecipado trimestral.",
    },
    team: {
      mode: "Híbrido",
      owner: findTeamMember("internal-1"),
      members: [findTeamMember("internal-2"), findTeamMember("client-1")],
      communicationChannel: "Canal dedicado no Teams",
    },
    highlights: [
      "Treinamento inicial concluído",
      "Checklist de implantação com 80% de progresso",
    ],
  },
  {
    id: "contract-horizonte",
    code: "CT-894",
    status: "Em revisão",
    client: clientesDetalhados[1],
    enterprise: empreendimentosMock[2],
    proposal: propostasMock[1],
    signature: {
      status: "Pendente",
      pendingSigners: ["Diretoria jurídica", clientesDetalhados[1].contatoPrincipal.nome],
      lastSentAt: "2024-09-12T16:45:00-03:00",
      deadline: "2024-09-28",
    },
    financialSummary: {
      totalValue: 1_100_000,
      executedPercentage: 0.12,
      outstandingAmount: 968_000,
      nextInvoiceDate: "2024-09-30",
    },
    docConfig: {
      templateId: "tpl-corporativo-2024",
      templateName: "Template corporativo com addendum",
      version: "v1.9",
      signaturePlatform: "DocuSign",
      requiresWitness: false,
      sendForLegalReview: true,
      autoReminders: false,
      lastUpdated: "2024-09-05",
      attachmentUrls: ["https://files.pleione.com/politica-comercial.pdf"],
    },
    terms: {
      startDate: "2024-10-01",
      endDate: "2025-09-30",
      renewal: "Sob demanda",
      responsibilities: [
        "Entrega de relatórios executivos mensais",
        "Disponibilização de squad dedicado para implantação",
      ],
      guarantees: [
        "Seguro performance incluído",
        "Garantia de resposta crítica em até 4 horas úteis",
      ],
      keyClauses: [
        "Penalidade de 1% do valor mensal por atraso superior a 48h",
        "Exclusividade em consultoria para segmento hospitalar",
      ],
      noticePeriodDays: 60,
    },
    billing: {
      totalValue: 1_100_000,
      currency: "BRL",
      billingCycle: "Por marco",
      taxes: [
        { name: "ISS", rate: 0.05 },
        { name: "INSS retido", rate: 0.11 },
      ],
      paymentConditions: [
        "30% após entrega do plano diretor",
        "40% após conclusão da fase de implantação",
        "30% na aceitação final",
      ],
      discountPolicy: "Aplicar reajuste IPCA acumulado após 12 meses.",
    },
    team: {
      mode: "Presencial",
      owner: findTeamMember("internal-2"),
      members: [findTeamMember("internal-1"), findTeamMember("client-2")],
      communicationChannel: "Reuniões semanais no escritório do cliente",
    },
    highlights: [
      "Addendum financeiro pendente de aprovação",
      "Documentação de compliance aguardando assinatura",
    ],
  },
  {
    id: "contract-atlantica",
    code: "CT-887",
    status: "Assinado",
    client: clientesDetalhados[2],
    enterprise: empreendimentosMock[1],
    proposal: propostasMock[2],
    signature: {
      status: "Concluída",
      pendingSigners: [],
      lastSentAt: "2024-07-20T09:15:00-03:00",
      deadline: "2024-07-25",
    },
    financialSummary: {
      totalValue: 980_000,
      executedPercentage: 0.78,
      outstandingAmount: 215_000,
      nextInvoiceDate: "2024-09-20",
    },
    docConfig: {
      templateId: "tpl-retrofit-2023",
      templateName: "Template retrofit comercial",
      version: "v2.4",
      signaturePlatform: "Portal interno",
      requiresWitness: false,
      sendForLegalReview: false,
      autoReminders: true,
      lastUpdated: "2024-06-30",
      attachmentUrls: ["https://files.pleione.com/mapa-riscos.pdf"],
    },
    terms: {
      startDate: "2023-08-01",
      endDate: "2026-07-31",
      renewal: "Automática",
      responsibilities: [
        "Monitoramento de indicadores trimestral",
        "Atualização do plano de ocupação comercial",
      ],
      guarantees: [
        "Seguro responsabilidade civil contratado pelo cliente",
        "Reserva técnica de 5% para ajustes extraordinários",
      ],
      keyClauses: [
        "Reajuste anual com base no IGP-M",
        "Revisão extraordinária mediante aviso de 45 dias",
      ],
      noticePeriodDays: 90,
    },
    billing: {
      totalValue: 980_000,
      currency: "BRL",
      billingCycle: "Trimestral",
      taxes: [
        { name: "ISS", rate: 0.02 },
        { name: "PIS/COFINS", rate: 0.0365 },
      ],
      paymentConditions: [
        "Faturamento trimestral com reajuste anual",
        "Parcelamento em 12 quotas iguais",
      ],
      discountPolicy: "Crédito de 2% em serviços adicionais para renovação antecipada.",
    },
    team: {
      mode: "Remoto",
      owner: findTeamMember("internal-3"),
      members: [findTeamMember("internal-1"), findTeamMember("client-3")],
      communicationChannel: "Canal no Slack com integrações de indicadores",
    },
    highlights: [
      "Cláusula de performance renegociada em julho",
      "Equipe do cliente treinada na plataforma Pleione",
    ],
  },
];

export const contractSelectableOptions = {
  clientes: clientesDetalhados,
  empreendimentos: empreendimentosMock,
  propostas: propostasMock,
};
