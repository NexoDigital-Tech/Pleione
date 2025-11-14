import { PageHeader } from "./components/PageHeader";

const quickActions = [
  { label: "Novo Cliente", helper: "Cadastro em 2 min", tone: "primary" },
  { label: "Nova Proposta", helper: "Modelo atualizado", tone: "accent" },
  { label: "Novo Projeto", helper: "Checklist automático", tone: "warning" },
  { label: "Upload Documento", helper: "Arraste e solte", tone: "info" },
  { label: "Nova Reunião", helper: "Sincroniza agenda", tone: "success" },
  { label: "Nova Tarefa", helper: "Distribua à equipe", tone: "muted" },
];

const performanceIndicators = [
  {
    label: "Novos Clientes",
    value: "24",
    helper: "+15% vs mês anterior",
  },
  {
    label: "Propostas Pendentes",
    value: "18",
    helper: "5 aguardando assinatura",
  },
  {
    label: "Valor de Contratos",
    value: "R$ 342K",
    helper: "+8% este trimestre",
  },
  {
    label: "Uploads Documentos",
    value: "92",
    helper: "30 revisões em andamento",
  },
];

const projectStatuses = [
  {
    nome: "Expansão Agrícola Sul",
    fase: "Licença Prévia",
    progresso: 72,
    responsavel: "Equipe Ambiental",
    prazo: "10 dias",
  },
  {
    nome: "Mineradora Horizonte",
    fase: "Estudo de Impacto",
    progresso: 48,
    responsavel: "Equipe Técnica",
    prazo: "18 dias",
  },
  {
    nome: "Parque Solar Nordeste",
    fase: "Licença de Instalação",
    progresso: 86,
    responsavel: "Equipe Jurídica",
    prazo: "5 dias",
  },
];

const environmentalAlerts = [
  {
    orgao: "IBAMA - Licença Operação",
    projeto: "Mineração Rio Verde",
    prazo: "3 dias",
    categoria: "urgente",
  },
  {
    orgao: "NATURATINS - Faixa de APP",
    projeto: "Hidrelétrica Tocantins",
    prazo: "7 dias",
    categoria: "alerta",
  },
  {
    orgao: "FEMA - Compensação Ambiental",
    projeto: "Complexo Eólico Ventos",
    prazo: "12 dias",
    categoria: "info",
  },
  {
    orgao: "IMA - Renovação Licença",
    projeto: "Porto Logístico Nordeste",
    prazo: "15 dias",
    categoria: "info",
  },
];

const recentActivities = [
  {
    titulo: "Licença Prévia aprovada",
    descricao: "Projeto Expansão Agrícola Sul",
    timestamp: "há 2 horas",
  },
  {
    titulo: "Proposta enviada",
    descricao: "Cliente Horizonte Renovável",
    timestamp: "há 4 horas",
  },
  {
    titulo: "Documento anexado",
    descricao: "Estudo hidrográfico - Rio Preto",
    timestamp: "há 6 horas",
  },
  {
    titulo: "Contato retornou",
    descricao: "Prefeitura de Serra Azul",
    timestamp: "há 1 dia",
  },
];

const quickModules = [
  {
    nome: "Clientes",
    descricao: "Gestão de contas e contatos",
    status: "Atualizado ontem",
  },
  {
    nome: "Propostas",
    descricao: "Modelos e aprovações",
    status: "5 aguardando",
  },
  {
    nome: "Projetos",
    descricao: "Linha do tempo e entregáveis",
    status: "3 com pendências",
  },
  {
    nome: "Contratos",
    descricao: "Assinaturas digitais e anexos",
    status: "2 para assinatura",
  },
  {
    nome: "Compliance",
    descricao: "Relatórios e auditorias",
    status: "Sem riscos",
  },
  {
    nome: "Relatórios",
    descricao: "Indicadores consolidados",
    status: "Atualizado hoje",
  },
];

function toneToClassName(tone: string) {
  switch (tone) {
    case "primary":
      return "bg-[var(--color-primary)]";
    case "accent":
      return "bg-[var(--color-accent)]";
    case "warning":
      return "bg-[var(--color-warning)]";
    case "info":
      return "bg-[var(--color-primary-soft)] text-[var(--color-primary)]";
    case "success":
      return "bg-[var(--color-success)]";
    default:
      return "bg-[var(--color-surface-muted)] text-[var(--color-text)]";
  }
}

function alertToneToClassName(tone: string) {
  switch (tone) {
    case "urgente":
      return "bg-[var(--color-danger)]";
    case "alerta":
      return "bg-[var(--color-warning)]";
    default:
      return "bg-[var(--color-primary)]";
  }
}

export default function Home() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Bem-vindo! Aqui você acompanha os principais indicadores, alertas ambientais e atividades recentes do ecossistema Pleione."
        actions={
          <>
            <button className="rounded-full border border-[var(--color-border)] px-5 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
              Personalizar
            </button>
            <button className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]">
              Criar Registro
            </button>
          </>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {quickActions.map((item) => (
          <button
            key={item.label}
            className="flex flex-col gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 text-left transition hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-soft)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]"
          >
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${toneToClassName(item.tone)}`}
            >
              {item.label[0]}
            </span>
            <span className="text-sm font-semibold text-[var(--color-text)]">{item.label}</span>
            <span className="text-xs text-[var(--color-text-muted)]">{item.helper}</span>
          </button>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {performanceIndicators.map((item) => (
          <article
            key={item.label}
            className="rounded-2xl bg-[var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              {item.label}
            </span>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-text)]">{item.value}</p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <div className="space-y-4">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Status de Projetos</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Resumo consolidado das frentes ambientais em andamento.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[var(--color-surface-alt)] p-1 text-xs font-semibold text-[var(--color-text-muted)]">
              <button className="rounded-full bg-[var(--color-primary)] px-4 py-1 text-white">Mensal</button>
              <button className="rounded-full px-4 py-1 transition hover:text-[var(--color-text)]">Trimestral</button>
            </div>
          </header>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projectStatuses.map((projeto) => (
              <article
                key={projeto.nome}
                className="flex h-full flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5"
              >
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[var(--color-text)]">{projeto.nome}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{projeto.fase}</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                    <span>Progresso</span>
                    <span>{projeto.progresso}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-surface-muted)]">
                    <div
                      className="h-2 rounded-full bg-[var(--color-primary)]"
                      style={{ width: `${projeto.progresso}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{projeto.responsavel}</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface-muted)] px-2 py-1 font-medium text-[var(--color-text)]">
                    {projeto.prazo}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-[var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Alertas de Órgãos Ambientais</h2>
            <ul className="mt-4 space-y-4">
              {environmentalAlerts.map((alerta) => (
                <li key={alerta.orgao} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{alerta.orgao}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{alerta.projeto}</p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white ${alertToneToClassName(alerta.categoria)}`}
                    >
                      {alerta.prazo}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Agenda do Dia</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center justify-between">
                <span>09:00 • Kick-off Projeto Vale Verde</span>
                <span className="text-xs font-semibold text-[var(--color-accent)]">Equipe Comercial</span>
              </li>
              <li className="flex items-center justify-between">
                <span>11:30 • Reunião Licenciamento</span>
                <span className="text-xs font-semibold text-[var(--color-accent)]">Equipe Ambiental</span>
              </li>
              <li className="flex items-center justify-between">
                <span>15:00 • Revisão contrato Horizonte</span>
                <span className="text-xs font-semibold text-[var(--color-accent)]">Jurídico</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Atividades Recentes</h2>
            <button className="text-sm font-semibold text-[var(--color-accent)] transition hover:text-[var(--color-accent-dark)]">
              Ver tudo
            </button>
          </header>
          <ul className="mt-4 space-y-4">
            {recentActivities.map((atividade) => (
              <li key={atividade.titulo} className="flex items-start gap-3 rounded-xl bg-[var(--color-surface)] p-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" aria-hidden />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--color-text)]">{atividade.titulo}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{atividade.descricao}</p>
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">{atividade.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-5">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Acesso Rápido aos Módulos</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickModules.map((modulo) => (
              <article
                key={modulo.nome}
                className="rounded-xl bg-[var(--color-surface)] p-4 transition hover:shadow-[var(--shadow-soft)]"
              >
                <h3 className="text-sm font-semibold text-[var(--color-text)]">{modulo.nome}</h3>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">{modulo.descricao}</p>
                <span className="mt-3 inline-block text-xs font-medium text-[var(--color-accent)]">{modulo.status}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
