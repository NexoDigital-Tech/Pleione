'use client';

interface SkeletonListProps {
  items?: number;
  withAvatar?: boolean;
}

export function SkeletonList({ items = 6, withAvatar = true }: SkeletonListProps) {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 shadow-sm">
      <div className="mb-4 h-5 w-40 rounded-full bg-[var(--color-surface-muted)]" />
      <ul className="space-y-3">
        {Array.from({ length: items }).map((_, index) => (
          <li key={index} className="flex items-center gap-3">
            {withAvatar && <span className="h-10 w-10 rounded-full bg-[var(--color-surface-muted)]" />}
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-[var(--color-surface-muted)]" />
              <div className="h-3 w-1/2 rounded-full bg-[var(--color-surface-muted)]" />
            </div>
            <div className="h-8 w-16 rounded-full bg-[var(--color-surface-muted)]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
