interface SkeletonCardProps {
  lines?: number;
  withBadge?: boolean;
}

export function SkeletonCard({ lines = 3, withBadge = false }: SkeletonCardProps) {
  return (
    <div className="flex animate-pulse flex-col gap-3 rounded-2xl bg-[color:var(--color-surface-alt)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 rounded-full bg-[color:var(--color-surface-muted)]" />
        {withBadge && <div className="h-6 w-16 rounded-full bg-[color:var(--color-accent-soft)]" />}
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="h-3 w-full rounded-full bg-[color:var(--color-surface-muted)]"
            style={{ opacity: 1 - index * 0.1 }}
          />
        ))}
      </div>
      <div className="mt-2 h-9 w-28 rounded-full bg-[color:var(--color-surface-muted)]" />
    </div>
  );
}
