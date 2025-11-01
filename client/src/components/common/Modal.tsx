// src/components/common/Modal.tsx
import { useEffect } from "react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="w-[min(92vw,560px)] rounded-2xl bg-panel border border-border p-5 shadow-neon animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {!!title && (
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">{title}</h2>
            <button
              className="rounded-md px-2 py-1 text-text/70 hover:text-neon focus:outline-none focus:ring-2 focus:ring-neon/60"
              aria-label="Close"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
