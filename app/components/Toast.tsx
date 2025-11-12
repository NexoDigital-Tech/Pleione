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
    'border-[color:var(--color-success)] bg-[color:var(--color-success)]/10 text-[color:var(--color-success)]',
  error:
    'border-[color:var(--color-danger)] bg-[color:var(--color-danger)]/10 text-[color:var(--color-danger)]',
  info:
    'border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/10 text-[color:var(--color-primary)]',
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
          <p className="mt-1 text-sm leading-snug text-[color:var(--color-text)]">{message}</p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-xs font-semibold uppercase text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}
