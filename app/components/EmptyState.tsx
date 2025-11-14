"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-lg">📄</div>
      <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
      <p className="max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-dark)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
