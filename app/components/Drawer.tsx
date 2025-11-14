"use client";

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from "react";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "iframe",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[contentEditable=true]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Drawer({ open, onClose, title, description, children }: DrawerProps) {
  const titleId = useId();
  const descriptionId = useId();
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) {
          return;
        }

        const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)).filter(
          (element) => element.offsetParent !== null,
        );

        if (focusable.length === 0) {
          event.preventDefault();
          panel.focus();
          return;
        }

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        } else if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      requestAnimationFrame(() => {
        const panel = panelRef.current;
        if (panel) {
          const focusable = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
          if (focusable) {
            focusable.focus();
          } else {
            panel.focus();
          }
        }
      });
      return;
    }

    const toRestore = restoreFocusRef.current;
    if (toRestore) {
      toRestore.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === containerRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onMouseDown={handleOverlayClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="flex h-full w-full max-w-xl flex-col gap-6 border-l border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 shadow-[var(--shadow-soft)] focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-[var(--color-text-muted)]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-transparent px-2 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto space-y-6 text-sm text-[var(--color-text-muted)]">
          {children}
        </div>
      </div>
    </div>
  );
}
