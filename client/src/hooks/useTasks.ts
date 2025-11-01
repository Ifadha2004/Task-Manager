import { useEffect, useState, useCallback } from "react";
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

  const fetchNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = filter === "all" ? {} : { status: filter };
      const { data } = await http.get("/tasks", { params });
      const list = Array.isArray(data) ? data : (data?.tasks ?? []);
      setTasks(list);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void fetchNow(); }, [fetchNow]);

  return { loading, tasks, error, refetch: fetchNow };
}

export function useMyTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskLite[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchNow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await http.get("/tasks/mine");
      const list = Array.isArray(data) ? data : (data?.tasks ?? []);
      setTasks(list);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchNow(); }, [fetchNow]);

  return { loading, tasks, error, refetch: fetchNow };
}
