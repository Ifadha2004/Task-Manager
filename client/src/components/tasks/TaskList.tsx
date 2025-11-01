import { Link } from "react-router-dom";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import ConfirmDialog from "../common/ConfirmDialog";
import EditTaskModal from "./EditTaskModal";
import { http } from "../../api/http";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../lib/toast";
import TaskCard from "./TaskCard"; 

export type TaskCard = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  dueDate?: string | null;
  createdBy?: { name: string } | null;
  assignedUser?: { name: string } | null;
  // createdAt?: string; // (kept for potential future use)
};

type Props = {
  loading: boolean;
  tasks: TaskCard[];
  onRefresh?: () => void;
};

export default function TaskList({ loading, tasks, onRefresh }: Props) {
  const toast = useToast();
  const [editing, setEditing] = useState<TaskCard | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // (kept) close any open popovers via outside click if you later add more menus here
  const [_openMenuId, setOpenMenuId] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) setOpenMenuId(null);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  async function handleDelete(id: number) {
    await http.delete(`/tasks/${id}`);
    toast.success("Task deleted", { title: "Removed" });
    setDeletingId(null);
    onRefresh?.();
  }

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
    <>
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tasks.map((t) => (
          <li key={t.id}>
            <TaskCard
              task={t}
              onRefresh={onRefresh}
              onEdit={(task) => setEditing(task)}
              onDelete={(id) => setDeletingId(id)}
            />
          </li>
        ))}
      </ul>

      {editing && (
        <EditTaskModal
          open={!!editing}
          task={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => {
            setEditing(null);
            onRefresh?.();
          }}
        />
      )}

      <ConfirmDialog
        open={deletingId != null}
        title="Delete Task"
        message="This action cannot be undone. Are you sure you want to delete this task?"
        confirmLabel="Delete"
        onCancel={() => setDeletingId(null)}
        onConfirm={() => (deletingId != null ? handleDelete(deletingId) : undefined)}
      />
    </>
  );
}
