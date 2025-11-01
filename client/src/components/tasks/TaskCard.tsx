import { Link } from "react-router-dom";
import StatusToggle from "./StatusToggle";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../lib/format";
import type { TaskCard as Task } from "./TaskList";

// Mini Avatar Component (for Assignee)
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  return (
    <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 border border-white/20 text-[10px] font-semibold text-zinc-200 shadow-sm">
      {initials}
    </div>
  );
}

// Due Progress Bar
function DueProgress({ createdAt, dueDate }: { createdAt?: string; dueDate?: string }) {
  if (!dueDate) return null;
  const now = Date.now();
  const start = createdAt ? new Date(createdAt).getTime() : now - 1000 * 60 * 60 * 24 * 3;
  const end = new Date(dueDate).getTime();
  const pct = Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));

  const color =
    pct > 90 ? "from-rose-400 to-red-400" : pct > 70 ? "from-amber-400 to-yellow-300" : "from-emerald-400 to-lime-300";

  return (
    <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// Glass card shell
function CardShell({ tint, children }: { tint: "success" | "pending"; children: React.ReactNode }) {
  const wash =
    tint === "success"
      ? "from-emerald-400/10 to-emerald-500/5"
      : "from-sky-400/10 to-slate-300/5";
  return (
    <div
      className={[
        "relative rounded-[18px] border border-white/[0.08] bg-white/[0.04] backdrop-blur-[10px]",
        "shadow-[0_6px_28px_rgba(0,0,0,.35)] hover:shadow-[0_8px_30px_rgba(0,0,0,.45)] transition-all duration-300",
        "p-5 md:p-6 overflow-hidden",
      ].join(" ")}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${wash}`} />
      <div className="absolute inset-0 rounded-[18px] ring-1 ring-white/[0.06]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onRefresh,
}: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: number) => void;
  onRefresh?: () => void;
}) {
  const completed = task.status === "completed";

  return (
    <CardShell tint={completed ? "success" : "pending"}>
      {/* Row 1: header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <Link to={`/tasks/${task.id}`}>
              <h3 className="font-semibold text-[16px] md:text-[17px] text-white hover:text-neon line-clamp-1 transition">
                {task.title}
              </h3>
            </Link>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <StatusToggle id={task.id} status={task.status} onChange={onRefresh} />

          <details className="relative">
            <summary className="list-none cursor-pointer px-2 py-1 rounded-md border border-white/10 hover:border-neon/40 text-zinc-300 select-none">
              •••
            </summary>
            <div className="absolute right-0 mt-1 z-30 min-w-[150px] rounded-md border border-white/10 bg-panel shadow-lg overflow-hidden">
              <button
                onClick={() => onEdit(task)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-white/5"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="w-full text-left px-3 py-2 text-sm text-rose-300 hover:bg-rose-500/10"
              >
                Delete
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* Row 2: description */}
      <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
        {task.description || <span className="italic text-zinc-500">No description</span>}
      </p>

      {/* Row 3: meta */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-400">
        {task.dueDate && (
          <span>
            Due: <span className="text-zinc-300">{formatDate(task.dueDate)}</span>
          </span>
        )}
        {task.assignedUser?.name && (
          <span className="inline-flex items-center gap-1">
            <Avatar name={task.assignedUser.name} />
            <span className="text-zinc-300">{task.assignedUser.name}</span>
          </span>
        )}
        {task.createdBy?.name && (
          <span>
            By: <span className="text-zinc-300">{task.createdBy.name}</span>
          </span>
        )}
      </div>

      {/* Row 4: progress */}
      <DueProgress dueDate={task.dueDate ?? undefined} />
    </CardShell>
  );
}
