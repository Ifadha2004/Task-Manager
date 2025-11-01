import { useEffect, useState } from "react";
import { http } from "../api/http";

export type TaskLite = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  dueDate?: string | null;
  createdBy?: { name: string } | null;
  assignedUser?: { name: string } | null;
};

export function useTasks(filter: "all" | "pending" | "completed") {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const params = filter === "all" ? {} : { status: filter };
        const { data } = await http.get("/tasks", { params });
        const list = Array.isArray(data) ? data : (data?.tasks ?? []);
        if (!cancelled) setTasks(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [filter]);

  return { loading, tasks, error };
}

export function useMyTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await http.get("/tasks/mine");
        const list = Array.isArray(data) ? data : (data?.tasks ?? []);
        if (!cancelled) setTasks(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to fetch tasks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { loading, tasks, error };
}
