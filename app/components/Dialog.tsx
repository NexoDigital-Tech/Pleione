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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-alt)] p-6 shadow-[var(--shadow-soft)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-transparent px-2 py-1 text-sm font-semibold text-[color:var(--color-text-muted)] transition hover:border-[color:var(--color-border)] hover:text-[color:var(--color-text)]"
          aria-label="Fechar"
        >
          ×
        </button>
        <header className="pr-8">
          <h2 className="text-lg font-semibold text-[color:var(--color-text)]">{title}</h2>
          {description && <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{description}</p>}
        </header>
        <div className="mt-6 space-y-4 text-sm text-[color:var(--color-text-muted)]">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
