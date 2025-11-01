import { useMemo, useState } from "react";
import TaskList from "../components/tasks/TaskList";
import { useTasks } from "../hooks/useTasks";

function TaskFilters({
  value, onChange,
}: { value: "all" | "pending" | "completed"; onChange: (v: "all" | "pending" | "completed") => void }) {
  const base = "px-3 py-1 rounded-md border border-border text-sm";
  const active = "bg-neon/20 text-neon";
  return (
    <div className="flex gap-2">
      {(["all","pending","completed"] as const).map(k => (
        <button key={k} className={`${base} ${value===k?active:"text-zinc-300"}`} onClick={()=>onChange(k)}>{k[0].toUpperCase()+k.slice(1)}</button>
      ))}
    </div>
  );
}

type SortKey = "dueAsc" | "dueDesc" | "titleAsc" | "titleDesc" | "assignee";

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const { loading, tasks, refetch } = useTasks(filter);

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("dueAsc");

  const view = useMemo(() => {
    const norm = (s: string) => s.toLowerCase();
    const filtered = tasks.filter(t => {
      const hay = `${t.title} ${t.description ?? ""} ${t.assignedUser?.name ?? ""}`.toLowerCase();
      return hay.includes(norm(q));
    });

    const asTime = (d?: string|null) => d ? new Date(d).getTime() : Number.MAX_SAFE_INTEGER;

    return [...filtered].sort((a,b) => {
      switch (sort) {
        case "dueAsc": return asTime(a.dueDate) - asTime(b.dueDate);
        case "dueDesc": return asTime(b.dueDate) - asTime(a.dueDate);
        case "titleAsc": return a.title.localeCompare(b.title);
        case "titleDesc": return b.title.localeCompare(a.title);
        case "assignee": return (a.assignedUser?.name ?? "").localeCompare(b.assignedUser?.name ?? "");
      }
    });
  }, [tasks, q, sort]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-text">All Tasks</h1>
        <TaskFilters value={filter} onChange={setFilter} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search title, description, assignee…"
          className="w-full sm:w-72 rounded-md border border-border bg-panel px-3 py-2 text-sm"
        />
        <select
          value={sort}
          onChange={(e)=>setSort(e.target.value as any)}
          className="rounded-md border border-border bg-panel px-3 py-2 text-sm"
        >
          <option value="dueAsc">Due date ↑</option>
          <option value="dueDesc">Due date ↓</option>
          <option value="titleAsc">Title A–Z</option>
          <option value="titleDesc">Title Z–A</option>
          <option value="assignee">Assignee A–Z</option>
        </select>
      </div>

      <TaskList loading={loading} tasks={view} onRefresh={refetch} />
    </div>
  );
}
