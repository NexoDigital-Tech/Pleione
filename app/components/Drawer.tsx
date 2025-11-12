'use client';

import { useEffect, type ReactNode } from 'react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, description, children, footer }: DrawerProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="flex-1" onClick={onClose} aria-hidden="true" />
      <div className="flex h-full w-full max-w-md flex-col border-l border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] shadow-[var(--shadow-soft)]">
        <header className="flex items-start justify-between border-b border-[color:var(--color-border)] px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-1 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:border-[color:var(--color-border)] hover:text-[color:var(--color-text)]"
            aria-label="Fechar"
          >
            ×
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-[color:var(--color-text-muted)]">{children}</div>
        {footer && <div className="border-t border-[color:var(--color-border)] px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
