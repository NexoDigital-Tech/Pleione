export type NavIconKey =
  | "dashboard"
  | "users"
  | "buildings"
  | "file-text"
  | "clipboard-check"
  | "grid"
  | "monitor";

export type NavConfigItem = {
  label: string;
  href: string;
  icon: NavIconKey;
};

export const NAV_ITEMS: NavConfigItem[] = [
  { label: "Dashboard", href: "/", icon: "dashboard" },
  { label: "Clientes", href: "/clientes", icon: "users" },
  { label: "Empreendimentos", href: "/empreendimentos", icon: "buildings" },
  { label: "Propostas", href: "/propostas", icon: "file-text" },
  { label: "Contratos", href: "/contratos", icon: "clipboard-check" },
  { label: "Catálogo Serviços", href: "/catalogo", icon: "grid" },
  { label: "Portal Cliente", href: "/portal-do-cliente", icon: "monitor" },
];
