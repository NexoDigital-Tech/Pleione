"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type BreadcrumbMap = Record<string, string>;

interface BreadcrumbsProps {
  routeLabels: BreadcrumbMap;
}

export function Breadcrumbs({ routeLabels }: BreadcrumbsProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = routeLabels[href] ?? segment;
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]" aria-label="Breadcrumb">
      <Link href="/" className="font-medium text-[var(--color-text)] hover:text-[var(--color-primary)]">
        Início
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          <Link
            href={crumb.href}
            className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
