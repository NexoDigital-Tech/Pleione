"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";

import { ChevronDownIcon } from "./icons";

export type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const [dashboard, ...cadastros] = items;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-2 text-lg font-semibold text-[var(--color-primary)]">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-base font-bold">
          PL
        </span>
        Pleione
      </div>
      <nav className="mt-8 flex-1 text-sm font-medium">
        {dashboard ? (
          <SidebarLink item={dashboard} isActive={pathname === dashboard.href} />
        ) : null}

        {cadastros.length > 0 ? (
          <div className="mt-6">
            <div className="flex items-center justify-between px-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              <span>Cadastros</span>
              <ChevronDownIcon className="h-4 w-4" />
            </div>
            <div className="mt-2 space-y-1">
              {cadastros.map((item) => (
                <SidebarLink key={item.href} item={item} isActive={pathname === item.href} />
              ))}
            </div>
          </div>
        ) : null}
      </nav>
      <div className="mt-6 rounded-lg bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-text-muted)]">
        Última atualização de layout
        <br />
        <span className="font-semibold text-[var(--color-text)]">Sprint 1</span>
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  item: NavItem;
  isActive: boolean;
}

function SidebarLink({ item, isActive }: SidebarLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
        isActive
          ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
          : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-semibold">{item.label}</span>
    </Link>
  );
}
