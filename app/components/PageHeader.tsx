"use client";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[color:var(--color-surface-alt)] p-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[color:var(--color-text)]">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-text-muted)]">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
