import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react"; // optional: for a clean close icon (lucide-react already installed with shadcn)

type Kind = "success" | "error" | "info";
type Toast = { id: number; kind: Kind; title?: string; message: string; timeout?: number };

type ToastCtx = {
  show: (t: Omit<Toast, "id">) => void;
  success: (message: string, opts?: Partial<Omit<Toast, "id" | "message" | "kind">>) => void;
  error: (message: string, opts?: Partial<Omit<Toast, "id" | "message" | "kind">>) => void;
  info: (message: string, opts?: Partial<Omit<Toast, "id" | "message" | "kind">>) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setItems((xs) => xs.filter((t) => t.id !== id));
  }, []);

  const show = useCallback<ToastCtx["show"]>(
    ({ kind, message, title, timeout = 3500 }) => {
      const id = Date.now() + Math.random();
      setItems((xs) => [...xs, { id, kind, message, title, timeout }]);
      if (timeout > 0) setTimeout(() => remove(id), timeout);
    },
    [remove]
  );

  const api = useMemo<ToastCtx>(
    () => ({
      show,
      success: (msg, opts) => show({ kind: "success", message: msg, ...opts }),
      error: (msg, opts) => show({ kind: "error", message: msg, ...opts }),
      info: (msg, opts) => show({ kind: "info", message: msg, ...opts }),
    }),
    [show]
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end"
          role="region"
          aria-label="Notifications"
          aria-live="polite"
        >
          {items.map((t) => (
            <div
              key={t.id}
              className={[
                "relative min-w-[260px] max-w-[340px] rounded-lg border px-4 py-3 shadow-lg backdrop-blur transition-all animate-in fade-in slide-in-from-bottom-2",
                "flex flex-col gap-1 text-sm",
                t.kind === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "",
                t.kind === "error"
                  ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
                  : "",
                t.kind === "info"
                  ? "border-zinc-600 bg-zinc-800/60 text-zinc-200"
                  : "",
              ].join(" ")}
            >
              {/* Header: title + close */}
              <div className="flex items-center justify-between">
                {t.title && <div className="font-medium">{t.title}</div>}
                <button
                  onClick={() => remove(t.id)}
                  className="ml-2 text-zinc-400 hover:text-zinc-200 transition"
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body: message */}
              <div className="leading-snug">{t.message}</div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
