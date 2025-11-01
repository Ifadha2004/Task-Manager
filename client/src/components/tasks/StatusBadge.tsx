export default function StatusBadge({ status }: { status: "pending" | "completed" }) {
  const base = "px-2 py-0.5 text-xs rounded-full border inline-flex items-center gap-1";
  if (status === "completed") {
    return (
      <span className={`${base} border-neon/50 text-neon`}>
        <svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
          <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Completed
      </span>
    );
  }
  return <span className={`${base} border-zinc-600 text-zinc-300`}>Pending</span>;
}
