import { useMemo, useState } from "react";
import TaskList from "../components/tasks/TaskList";
import { useMyTasks } from "../hooks/useTasks";
import { Link } from "react-router-dom";

type Quick = "all" | "overdue" | "week";

export default function MyTasksPage() {
  const { loading, tasks, refetch } = useMyTasks();
  const [quick, setQuick] = useState<Quick>("all");

  const view = useMemo(() => {
    const now = new Date();
    const startOfWeek = (() => {
      const d = new Date(now);
      const day = d.getDay(); // 0 Sun
      const diff = (day + 6) % 7; // move to Monday
      d.setDate(d.getDate() - diff);
      d.setHours(0, 0, 0, 0);
      return d;
    })();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const isOverdue = (iso?: string | null) =>
      !!iso && new Date(iso).getTime() < now.getTime();

    const isThisWeek = (iso?: string | null) => {
      if (!iso) return false;
      const t = new Date(iso);
      return t >= startOfWeek && t < endOfWeek;
    };

    const filtered = tasks.filter((t) => {
      if (quick === "overdue") return isOverdue(t.dueDate);
      if (quick === "week") return isThisWeek(t.dueDate);
      return true;
    });

    // default sort: nearest due date first
    const asTime = (d?: string | null) =>
      d ? new Date(d).getTime() : Number.MAX_SAFE_INTEGER;
    return [...filtered].sort((a, b) => asTime(a.dueDate) - asTime(b.dueDate));
  }, [tasks, quick]);

  // Simple link to create a new task (no dev-only USER_ID_KEY)
  const newTaskLink = "/tasks/new";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-text">My Tasks</h1>

        <div className="flex gap-2">
          {(["all", "overdue", "week"] as Quick[]).map((k) => (
            <button
              key={k}
              onClick={() => setQuick(k)}
              className={`px-3 py-1 rounded-md border text-sm ${
                quick === k
                  ? "border-neon text-neon bg-neon/10"
                  : "border-border text-zinc-300"
              }`}
            >
              {k === "all" ? "All" : k === "overdue" ? "Overdue" : "This week"}
            </button>
          ))}
        </div>
      </div>

      {/* Pass custom empty state with preselected assignee link */}
      {!loading && view.length === 0 ? (
        <div className="rounded-xl border border-border bg-panel p-6 text-zinc-300">
          <div className="mb-2 font-medium">No tasks in this view.</div>
          <div className="text-sm">
            Create one now →{" "}
            <Link to={newTaskLink} className="text-neon underline">
              + New Task
            </Link>
          </div>
        </div>
      ) : (
        <TaskList loading={loading} tasks={view} onRefresh={refetch} />
      )}
    </div>
  );
}
