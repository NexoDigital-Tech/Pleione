"use client";

import { useEffect, useId, useRef, type ReactNode, type MouseEvent } from "react";

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

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "md" | "lg" | "xl" | "full";
}

const sizeClasses: Record<NonNullable<DialogProps["size"]>, string> = {
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
  full: "max-w-6xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "lg",
}: DialogProps) {
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
          (element) => element.offsetParent !== null
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
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-10"
      onMouseDown={handleOverlayClick}
    >
      <div className={`mx-auto w-full ${sizeClasses[size]}`}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className="relative flex max-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 shadow-[var(--shadow-soft)]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full border border-transparent px-2 py-1 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-border)] hover:text-[var(--color-text)]"
            aria-label="Fechar"
          >
            ×
          </button>
          <header className="pr-8">
            <h2 id={titleId} className="text-lg font-semibold text-[var(--color-text)]">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-sm text-[var(--color-text-muted)]">
                {description}
              </p>
            )}
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
