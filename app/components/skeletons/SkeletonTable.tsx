interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-sm">
      <div className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-4">
        <div className="h-5 w-48 rounded-full bg-[color:var(--color-surface-alt)]" />
      </div>
      <div className="divide-y divide-[color:var(--color-border)]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 px-4 py-3"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((__, colIndex) => (
              <div key={colIndex} className="h-4 rounded-full bg-[color:var(--color-surface-muted)]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
