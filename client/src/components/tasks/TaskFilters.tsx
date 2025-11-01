type Props = {
  value: "all" | "pending" | "completed";
  onChange: (v: "all" | "pending" | "completed") => void;
};

export default function TaskFilters({ value, onChange }: Props) {
  const btn = "px-3 py-1.5 rounded-lg border text-sm transition";
  const active = "bg-background text-neon border-neon shadow-neon";
  const idle = "bg-panel text-zinc-300 border-border hover:border-neon/40";

  return (
    <div className="inline-flex gap-2">
      <button className={`${btn} ${value === "all" ? active : idle}`} onClick={() => onChange("all")}>
        All
      </button>
      <button className={`${btn} ${value === "pending" ? active : idle}`} onClick={() => onChange("pending")}>
        Pending
      </button>
      <button className={`${btn} ${value === "completed" ? active : idle}`} onClick={() => onChange("completed")}>
        Completed
      </button>
    </div>
  );
}
