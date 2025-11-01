import { useState } from "react";
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

export default function TasksPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const { loading, tasks, error } = useTasks(filter);
  {error && <div className="text-danger text-sm">{error}</div>}

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-text">All Tasks</h1>
        <TaskFilters value={filter} onChange={setFilter} />
      </div>
      <TaskList loading={loading} tasks={tasks} />
    </div>
  );
}
