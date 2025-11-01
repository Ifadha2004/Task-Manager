import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../lib/format";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";

export type TaskCard = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  dueDate?: string | null;
  createdBy?: { name: string } | null;
  assignedUser?: { name: string } | null;
};

export default function TaskList({ loading, tasks }: { loading: boolean; tasks: TaskCard[] }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-300">
        <Spinner /> <span>Loading…</span>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <EmptyState
        title="No tasks found."
        description="Create your first task to get started."
        action={<Link to="/tasks/new" className="text-neon underline">+ New Task</Link>}
      />
    );
  }

  return (
    <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {tasks.map((t) => {
        const completed = t.status === "completed";

        const cardBase =
          "relative block rounded-xl border bg-panel p-4 transition-all duration-200";
        const pendingFx =
          "border-border hover:border-neon/60 hover:shadow-neon";
        const completedFx =
          // softer, premium finish: slight dim + soft emerald ring (no thick border)
          "border-border/60 ring-1 ring-emerald-500/25 opacity-90 grayscale-[.1] hover:opacity-100 hover:grayscale-0 hover:ring-emerald-500/35";

        return (
          <li key={t.id}>
            <Link
              to={`/tasks/${t.id}`}
              className={[cardBase, completed ? completedFx : pendingFx].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-text line-clamp-1">{t.title}</h3>
                {/* single source of truth for status */}
                <StatusBadge status={t.status} />
              </div>

              {t.description ? (
                <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{t.description}</p>
              ) : (
                <p className="mt-1 text-sm text-zinc-500 italic">No description</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                {t.dueDate && (
                  <span>
                    Due: <span className="text-zinc-300">{formatDate(t.dueDate)}</span>
                  </span>
                )}
                {t.assignedUser?.name && (
                  <span>
                    Assignee: <span className="text-zinc-300">{t.assignedUser.name}</span>
                  </span>
                )}
                {t.createdBy?.name && (
                  <span>
                    By: <span className="text-zinc-300">{t.createdBy.name}</span>
                  </span>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
