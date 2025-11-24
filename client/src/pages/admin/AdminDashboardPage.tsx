// client/src/pages/admin/AdminDashboardPage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../api/http";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type AdminStats = {
  totalUsers: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
};

type UserTaskStats = {
  id: number;
  name: string | null;
  email: string | null;
  role: "admin" | "user";
  taskStats: {
    assignedTotal: number;
    completed: number;
    pending: number;
  };
};

export default function AdminDashboardPage() {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/tasks" replace />;
  }

  const statsQuery = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await http.get<AdminStats>("/admin/stats")).data,
  });

  const usersStatsQuery = useQuery({
    queryKey: ["admin", "users-with-task-stats"],
    queryFn: async () =>
      (await http.get<UserTaskStats[]>("/admin/users/with-task-stats")).data,
  });

  const stats = statsQuery.data;
  const usersStats = usersStatsQuery.data ?? [];

  const completionRate =
    stats && stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">Admin Dashboard</h1>
          <p className="text-sm text-zinc-400">
            Overview of system usage, task load, and completion trends.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          sub="All registered accounts"
        />
        <StatCard
          label="Total Tasks"
          value={stats?.totalTasks ?? 0}
          sub="Across the workspace"
        />
        <StatCard
          label="Completed"
          value={stats?.completedTasks ?? 0}
          sub={`${completionRate}% completion`}
        />
        <StatCard
          label="Pending"
          value={stats?.pendingTasks ?? 0}
          sub="Still in progress"
        />
        <StatCard
          label="Overdue"
          value={stats?.overdueTasks ?? 0}
          highlight
          sub="Past due date"
        />
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-panel p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Tasks per User (Assigned)
            </h2>
            <p className="text-xs text-zinc-400">
              Completed vs pending tasks for each assignee.
            </p>
          </div>
        </div>

        {usersStatsQuery.isLoading && (
          <div className="text-sm text-zinc-300">Loading user stats…</div>
        )}

        {!usersStatsQuery.isLoading && usersStats.length === 0 && (
          <div className="text-sm text-zinc-400">No task data yet.</div>
        )}

        {!usersStatsQuery.isLoading && usersStats.length > 0 && (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={usersStats.map((u) => ({
                  name: u.name || u.email || `User #${u.id}`,
                  completed: u.taskStats.completed,
                  pending: u.taskStats.pending,
                }))}
                margin={{ top: 10, right: 20, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 11, fill: "#b4b4c7" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#b4b4c7" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#06080c",
                    border: "1px solid #27272f",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend />
                <Bar dataKey="completed" stackId="a" />
                <Bar dataKey="pending" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border bg-panel p-4 flex flex-col gap-1",
        highlight
          ? "border-rose-500/40 bg-rose-500/5"
          : "border-border bg-panel",
      ].join(" ")}
    >
      <div className="text-xs text-zinc-400">{label}</div>
      <div className="text-2xl font-semibold text-text">{value}</div>
      {sub && <div className="text-xs text-zinc-500">{sub}</div>}
    </div>
  );
}
