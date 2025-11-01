import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  action,
  hint,
}: { title: string; description?: string; action?: ReactNode; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-panel p-10 text-center">
      <h3 className="text-zinc-200 font-semibold">{title}</h3>
      {description && <p className="text-zinc-400 mt-2">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
      {hint && <p className="text-xs text-zinc-500 mt-3">{hint}</p>}
    </div>
  );
}
