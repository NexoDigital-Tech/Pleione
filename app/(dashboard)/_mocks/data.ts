import { Client, ClientContact, Contact } from "@/app/types/client";

export const clientesMock: Client[] = [
  {
    id: "cli-001",
    type: "PF",
    name: "Marina Costa",
    document: "32165498701",
    segment: "Residencial",
    stage: "Ativo",
    potentialValue: 850000,
    addresses: [
      {
        id: "addr-001",
        label: "Residencial",
        street: "Rua das Palmeiras",
        number: "245",
        complement: "Apto 42",
        district: "Moema",
        city: "São Paulo",
        state: "SP",
        zipCode: "04534010",
        country: "Brasil",
      },
    ],
    contactPreferences: {
      email: true,
      phone: false,
      sms: false,
      whatsapp: true,
    },
    personDetails: {
      birthDate: "1988-05-10",
    },
    notes: "Cliente residencial com alto potencial para upsell de serviços de concierge.",
    createdAt: "2024-01-10T10:30:00.000Z",
    updatedAt: "2024-03-15T09:12:00.000Z",
  },
  {
    id: "cli-002",
    type: "PJ",
    name: "Construtora Horizonte LTDA",
    document: "35698745000120",
    segment: "Incorporação",
    stage: "Negociação",
    potentialValue: 2100000,
    addresses: [
      {
        id: "addr-002",
        label: "Matriz",
        street: "Avenida Sete de Setembro",
        number: "1870",
        district: "Centro",
        city: "Curitiba",
        state: "PR",
        zipCode: "80060070",
        country: "Brasil",
      },
      {
        id: "addr-003",
        label: "Filial",
        street: "Rua XV de Novembro",
        number: "1250",
        complement: "Conj. 902",
        district: "Centro",
        city: "Porto Alegre",
        state: "RS",
        zipCode: "90020011",
        country: "Brasil",
      },
    ],
    contactPreferences: {
      email: true,
      phone: true,
      sms: false,
      whatsapp: false,
    },
    companyDetails: {
      tradeName: "Construtora Horizonte",
      foundationDate: "2004-04-18",
      stateRegistration: "908.234.112.7",
    },
    notes: "Negociação avançada para pacote enterprise do portal de clientes.",
    createdAt: "2023-11-05T15:45:00.000Z",
    updatedAt: "2024-03-12T18:20:00.000Z",
  },
  {
    id: "cli-003",
    type: "PJ",
    name: "Grupo Atlântica Participações",
    document: "11478596000105",
    segment: "Comercial",
    stage: "Qualificação",
    potentialValue: 1500000,
    addresses: [
      {
        id: "addr-004",
        label: "Sede",
        street: "Alameda Santos",
        number: "1430",
        complement: "10º andar",
        district: "Jardins",
        city: "São Paulo",
        state: "SP",
        zipCode: "01418100",
        country: "Brasil",
      },
    ],
    contactPreferences: {
      email: true,
      phone: true,
      sms: true,
      whatsapp: false,
    },
    companyDetails: {
      tradeName: "Grupo Atlântica",
      foundationDate: "2012-09-01",
    },
    notes: "Precisa de integração personalizada com ERP proprietário e onboarding faseado.",
    createdAt: "2023-12-20T11:00:00.000Z",
    updatedAt: "2024-02-28T14:55:00.000Z",
  },
];

export const contatosMock: Contact[] = [
  {
    id: "ctt-001",
    name: "Marina Costa",
    role: "Proprietária",
    email: "marina.costa@email.com",
    phone: "1123456789",
    mobile: "11987654321",
    preferredChannels: {
      email: true,
      phone: false,
      sms: false,
      whatsapp: true,
    },
    notes: "Prefere contato no período da manhã.",
    createdAt: "2024-01-10T10:30:00.000Z",
    updatedAt: "2024-03-15T09:12:00.000Z",
  },
  {
    id: "ctt-002",
    name: "Luiz Andrade",
    role: "Diretor Comercial",
    department: "Negócios",
    email: "luiz.andrade@horizonte.com",
    phone: "4130457788",
    mobile: "41991234567",
    preferredChannels: {
      email: true,
      phone: true,
      sms: false,
      whatsapp: false,
    },
    createdAt: "2023-11-05T15:45:00.000Z",
    updatedAt: "2024-03-10T13:05:00.000Z",
  },
  {
    id: "ctt-003",
    name: "Paula Siqueira",
    role: "Coordenadora de Projetos",
    department: "Implantação",
    email: "paula.siqueira@horizonte.com",
    phone: "5130208899",
    mobile: "51993456789",
    preferredChannels: {
      email: true,
      phone: false,
      sms: false,
      whatsapp: true,
    },
    notes: "Responsável pelo cronograma das obras em Porto Alegre.",
    createdAt: "2023-12-01T12:10:00.000Z",
    updatedAt: "2024-02-22T17:40:00.000Z",
  },
  {
    id: "ctt-004",
    name: "Eduardo Lira",
    role: "CFO",
    email: "eduardo.lira@atlantica.com",
    phone: "1130458899",
    preferredChannels: {
      email: true,
      phone: true,
      sms: true,
      whatsapp: false,
    },
    notes: "Solicitou relatórios financeiros consolidados mensalmente.",
    createdAt: "2023-12-20T11:00:00.000Z",
    updatedAt: "2024-02-28T14:55:00.000Z",
  },
];

export const clienteContatoMock: ClientContact[] = [
  {
    id: "link-001",
    clientId: "cli-001",
    contactId: "ctt-001",
    isPrimary: true,
    receiveNotifications: true,
    createdAt: "2024-01-10T10:30:00.000Z",
    updatedAt: "2024-03-15T09:12:00.000Z",
  },
  {
    id: "link-002",
    clientId: "cli-002",
    contactId: "ctt-002",
    isPrimary: true,
    receiveNotifications: true,
    createdAt: "2023-11-05T15:45:00.000Z",
    updatedAt: "2024-03-10T13:05:00.000Z",
  },
  {
    id: "link-003",
    clientId: "cli-002",
    contactId: "ctt-003",
    isPrimary: false,
    receiveNotifications: true,
    createdAt: "2023-12-01T12:10:00.000Z",
    updatedAt: "2024-02-22T17:40:00.000Z",
  },
  {
    id: "link-004",
    clientId: "cli-003",
    contactId: "ctt-004",
    isPrimary: true,
    receiveNotifications: false,
    createdAt: "2023-12-20T11:00:00.000Z",
    updatedAt: "2024-02-28T14:55:00.000Z",
  },
];

export const empreendimentosMock = [
  {
    nome: "Parque das Flores",
    cidade: "Curitiba",
    fase: "Lançamento",
    progresso: 45,
  },
  {
    nome: "Vila Verde",
    cidade: "Porto Alegre",
    fase: "Pré-vendas",
    progresso: 20,
  },
  {
    nome: "Jardins do Sol",
    cidade: "São Paulo",
    fase: "Obras",
    progresso: 68,
  },
];

export const propostasMock = [
  { codigo: "PR-2045", cliente: "Residencial Aurora", status: "Em análise", valor: "R$ 420K" },
  { codigo: "PR-2042", cliente: "Construtora Horizonte", status: "Enviado", valor: "R$ 1,1M" },
  { codigo: "PR-2039", cliente: "Grupo Atlântica", status: "Rascunho", valor: "R$ 980K" },
];

export const contratosMock = [
  { codigo: "CT-901", cliente: "Residencial Aurora", vigencia: "2024-2026", status: "Ativo" },
  { codigo: "CT-894", cliente: "Grupo Atlântica", vigencia: "2024-2025", status: "Revisão" },
  { codigo: "CT-887", cliente: "Vila Verde", vigencia: "2023-2026", status: "Ativo" },
];

export const catalogoMock = [
  { nome: "Consultoria de Viabilidade", categoria: "Serviços", sla: "15 dias" },
  { nome: "Implantação CRM", categoria: "Tecnologia", sla: "30 dias" },
  { nome: "Treinamento Comercial", categoria: "Capacitação", sla: "7 dias" },
];

export const portalClienteMock = [
  {
    titulo: "Resumo financeiro",
    status: "Atualizado",
    ultimaAtualizacao: "há 2 horas",
  },
  {
    titulo: "Checklist de implantação",
    status: "2 itens pendentes",
    ultimaAtualizacao: "há 1 dia",
  },
  {
    titulo: "Atendimentos recentes",
    status: "3 solicitações em aberto",
    ultimaAtualizacao: "há 3 dias",
  },
];
