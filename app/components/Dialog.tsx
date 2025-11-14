'use client';

import { useEffect, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onClose, title, description, children, footer }: DialogProps) {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative flex max-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 shadow-[var(--shadow-soft)]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-transparent px-2 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
            aria-label="Fechar"
          >
            ×
          </button>
          <header className="pr-8">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
            {description && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{description}</p>}
          </header>
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto space-y-4 text-sm text-[var(--color-text-muted)]">
            {children}
          </div>
          {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
