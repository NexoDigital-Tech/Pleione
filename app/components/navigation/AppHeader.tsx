"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./Sidebar";

interface AppHeaderProps {
  items: NavItem[];
}

export function AppHeader({ items }: AppHeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const activeItem = useMemo(
    () => items.find((item) => item.href === pathname)?.label ?? "Início",
    [items, pathname],
  );

  return (
    <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)]">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3 text-sm text-[color:var(--color-text-muted)] lg:hidden">
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] text-[color:var(--color-text)] shadow-sm"
          >
            ☰
          </button>
          <span className="font-medium">{activeItem}</span>
        </div>
        <div className="hidden items-center gap-6 lg:flex">
          <nav className="flex items-center gap-2 text-sm font-medium">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]"
                      : "text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden flex-col text-xs text-[color:var(--color-text-muted)] sm:flex">
            <span>Bem-vindo(a),</span>
            <span className="font-medium text-[color:var(--color-text)]">Equipe Pleione</span>
          </div>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-primary-soft)] text-sm font-semibold text-[color:var(--color-primary)]">
            EP
          </span>
        </div>
      </div>
      {isMenuOpen && (
        <nav className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] px-4 py-2 text-sm font-medium text-[color:var(--color-text-muted)] lg:hidden">
          <div className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]"
                      : "hover:bg-[color:var(--color-surface-muted)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
