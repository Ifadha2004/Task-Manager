import { useEffect, useState } from "react";
import { http } from "../api/http";
import type { TaskCard } from "../components/tasks/TaskList";

export function useMyTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<TaskCard[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data } = await http.get<TaskCard[]>("/tasks/mine");
        if (!cancelled) setTasks(data);
      } catch (e) {
        console.error("Failed to fetch my tasks", e);
        if (!cancelled) setTasks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { loading, tasks };
}
