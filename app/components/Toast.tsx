'use client';

import { useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
  duration?: number;
}

const styles: Record<ToastType, string> = {
  success:
    'border-[var(--color-success)] bg-[var(--color-success)]/10 text-[var(--color-success)]',
  error:
    'border-[var(--color-danger)] bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  info:
    'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
};

export function Toast({ message, type = 'info', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (!onClose) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onClose();
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      className={`fixed bottom-6 right-6 z-50 max-w-xs rounded-xl border px-4 py-3 text-sm shadow-lg transition ${styles[type]}`}
    >
      <div className="flex items-start gap-3">
        <div>
          <p className="font-semibold capitalize">{type === 'error' ? 'Erro' : type === 'success' ? 'Sucesso' : 'Aviso'}</p>
          <p className="mt-1 text-sm leading-snug text-[var(--color-text)]">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xs font-semibold uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
