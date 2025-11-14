"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-6 lg:flex lg:flex-col">
      <div className="flex items-center gap-2 px-2 text-lg font-semibold text-[var(--color-primary)]">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-base font-bold">
          PL
        </span>
        Pleione
      </div>
      <nav className="mt-8 flex-1 space-y-1 text-sm font-medium text-[var(--color-text-muted)]">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col rounded-lg px-3 py-2 transition-colors duration-150 ${
                isActive
                  ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                  : "hover:bg-[var(--color-surface-muted)]"
              }`}
            >
              <span className="text-sm font-semibold">{item.label}</span>
              {item.description && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {item.description}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-lg bg-[var(--color-surface-muted)] p-3 text-xs text-[var(--color-text-muted)]">
        Última atualização de layout
        <br />
        <span className="font-semibold text-[var(--color-text)]">Sprint 1</span>
      </div>
    </aside>
  );
}
