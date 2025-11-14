import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AppHeader } from "./components/navigation/AppHeader";
import { Breadcrumbs } from "./components/navigation/Breadcrumbs";
import { Sidebar, type NavItem } from "./components/navigation/Sidebar";
import {
  BuildingsIcon,
  ClipboardCheckIcon,
  DashboardIcon,
  FileTextIcon,
  GridIcon,
  MonitorIcon,
  UsersIcon,
} from "./components/navigation/icons";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: DashboardIcon },
  { label: "Clientes", href: "/clientes", icon: UsersIcon },
  { label: "Empreendimentos", href: "/empreendimentos", icon: BuildingsIcon },
  { label: "Propostas", href: "/propostas", icon: FileTextIcon },
  { label: "Contratos", href: "/contratos", icon: ClipboardCheckIcon },
  { label: "Catálogo Serviços", href: "/catalogo", icon: GridIcon },
  { label: "Portal Cliente", href: "/portal-do-cliente", icon: MonitorIcon },
];

const ROUTE_LABELS = NAV_ITEMS.reduce<Record<string, string>>((acc, item) => {
  acc[item.href] = item.label;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Pleione – Plataforma Comercial",
  description: "Interface mockada da Sprint 1: casca de UI navegável",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-[var(--color-surface)] text-[var(--color-text)]">
          <div className="flex min-h-screen flex-col lg:flex-row">
            <Sidebar items={NAV_ITEMS} />
            <div className="flex flex-1 flex-col">
              <AppHeader items={NAV_ITEMS} />
              <main className="flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                <Breadcrumbs routeLabels={ROUTE_LABELS} />
                <div className="space-y-6">{children}</div>
              </main>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
