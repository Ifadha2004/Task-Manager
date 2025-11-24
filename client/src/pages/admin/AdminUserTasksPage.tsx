import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/http";
import type { Task, User } from "../../lib/types";
import TaskList from "../../components/tasks/TaskList";

export default function AdminUserTasksPage() {
  const { user: currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/admin/users" replace />;
  if (currentUser?.role !== "admin") return <Navigate to="/tasks" replace />;

  const userId = Number(id);

  const userQuery = useQuery({
    queryKey: ["admin", "user", userId],
    queryFn: async () => (await http.get<User>(`/users/${userId}`)).data,
  });

  const tasksQuery = useQuery({
    queryKey: ["admin", "user-tasks", userId],
    queryFn: async () => (await http.get<Task[]>(`/users/${userId}/tasks`)).data,
  });

  const u = userQuery.data;
  const tasks = tasksQuery.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">
            Tasks for {u?.name || u?.email || `User #${userId}`}
          </h1>
          <p className="text-sm text-zinc-400">
            Showing tasks created by or assigned to this user.
          </p>
        </div>
        <Link
          to="/admin/users"
          className="text-sm text-neon underline underline-offset-4"
        >
          ← Back to users
        </Link>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-panel p-4 md:p-6">
        {tasksQuery.isLoading && (
          <div className="text-sm text-zinc-300">Loading tasks…</div>
        )}

        {!tasksQuery.isLoading && tasks.length === 0 && (
          <div className="text-sm text-zinc-400">No tasks found for this user.</div>
        )}

        {!tasksQuery.isLoading && tasks.length > 0 && (
          <TaskList
            loading={tasksQuery.isLoading}
            tasks={tasks as any}
            onRefresh={tasksQuery.refetch}
          />
        )}
      </div>
    </div>
  );
}
