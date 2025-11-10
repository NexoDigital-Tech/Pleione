export const clientesMock = [
  { nome: "Construtora Horizonte", segmento: "Incorporação", fase: "Ativo", valorPotencial: "R$ 1,2M" },
  { nome: "Residencial Aurora", segmento: "Condomínios", fase: "Qualificação", valorPotencial: "R$ 850K" },
  { nome: "Grupo Atlântica", segmento: "Comercial", fase: "Negociação", valorPotencial: "R$ 2,1M" },
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
