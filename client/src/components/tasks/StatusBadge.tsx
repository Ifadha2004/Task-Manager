import { CheckCircle2, Clock } from "lucide-react";

export default function StatusBadge({ status }: { status: "pending" | "completed" }) {
  const base =
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium shadow-sm ring-1";
  if (status === "completed") {
    return (
      <span
        className={`${base} text-emerald-300 bg-emerald-500/10 ring-emerald-500/30`}
      >
        <CheckCircle2 size={12} /> Completed
      </span>
    );
  }
  return (
    <span
      className={`${base} text-slate-300 bg-slate-500/10 ring-slate-500/25`}
    >
      <Clock size={12} /> Pending
    </span>
  );
}
