"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { Breadcrumbs, type BreadcrumbMap } from "./Breadcrumbs";

interface AppHeaderProps {
  routeLabels: BreadcrumbMap;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onSidebarToggle?: () => void;
}

export function AppHeader({ routeLabels, onSearchChange, onSearchSubmit, onSidebarToggle }: AppHeaderProps) {
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState("");

  const activeLabel = routeLabels[pathname] ?? routeLabels["/"] ?? "Dashboard";

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchValue.trim().length === 0) {
      return;
    }
    if (onSearchSubmit) {
      onSearchSubmit(searchValue);
    } else {
      console.log("Buscar:", searchValue);
    }
  };

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
      <div className="flex flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4">
        <div className="flex w-full items-center gap-3 lg:w-auto lg:flex-1">
          <button
            type="button"
            aria-label="Alternar menu lateral"
            onClick={() => onSidebarToggle?.()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text)] shadow-sm lg:hidden"
          >
            ☰
          </button>
          <div className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
            <Breadcrumbs routeLabels={routeLabels} />
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3 lg:flex-1 lg:justify-end lg:gap-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs lg:max-w-md lg:flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth={1.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={`Buscar em ${activeLabel}`}
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] py-2 pl-10 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-soft)]"
              aria-label="Buscar"
            />
          </form>
          <div className="flex items-center gap-3">
            <div className="hidden flex-col text-xs text-[var(--color-text-muted)] sm:flex">
              <span>Bem-vindo(a),</span>
              <span className="font-medium text-[var(--color-text)]">Equipe Pleione</span>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-sm font-semibold text-[var(--color-primary)]">
              EP
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
