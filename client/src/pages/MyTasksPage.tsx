import TaskList from "../components/tasks/TaskList";
// IMPORTANT: import from useTasks (not useMyTasks.ts)
import { useMyTasks } from "../hooks/useTasks";

export default function MyTasksPage() {
  const { loading, tasks, error } = useMyTasks();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-text">My Tasks</h1>
      {error && <div className="text-danger text-sm">{error}</div>}
      <TaskList loading={loading} tasks={tasks} />
    </div>
  );
}
