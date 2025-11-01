import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../../lib/format";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";
import StatusToggle from "./StatusToggle";
import ConfirmDialog from "../common/ConfirmDialog";
import EditTaskModal from "./EditTaskModal";
import { http } from "../../api/http";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../lib/toast";

export type TaskCard = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  dueDate?: string | null;
  createdBy?: { name: string } | null;
  assignedUser?: { name: string } | null;
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

  // popover state
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  async function handleDelete(id: number) {
    await http.delete(`/tasks/${id}`);
    toast.success("Task deleted", { title: "Removed" });
    setDeletingId(null);
    onRefresh?.();
  }

  // close menu on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

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
        {tasks.map((t) => {
          const completed = t.status === "completed";
          const menuOpen = openMenuId === t.id;

          return (
            <li key={t.id}>
              <div
                className={[
                  "relative rounded-xl border border-border bg-panel p-4 transition-all duration-200",
                  completed ? "ring-1 ring-emerald-500/40" : "hover:border-neon/60 hover:shadow-neon",
                ].join(" ")}
              >
                {/* row 1: title + status + actions */}
                <div className="flex items-start justify-between gap-3">
                  <Link to={`/tasks/${t.id}`} className="block flex-1 min-w-0">
                    <h3 className="font-semibold text-text line-clamp-1">{t.title}</h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    {/* inline toggle (prevent bubbling) */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <StatusToggle id={t.id} status={t.status} onChange={onRefresh} />
                    </div>

                    {/* actions menu (click to open) */}
                    <div
                      className="relative"
                      ref={menuOpen ? popoverRef : null}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="px-2 py-1 rounded-md border border-zinc-700 text-zinc-300 hover:border-neon/60 focus:outline-none"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-controls={`task-menu-${t.id}`}
                        onClick={() => setOpenMenuId(menuOpen ? null : t.id)}
                      >
                        •••
                      </button>

                      {menuOpen && (
                        <div
                          id={`task-menu-${t.id}`}
                          role="menu"
                          className="absolute right-0 mt-1 z-30 min-w-[160px] rounded-md border border-border bg-panel shadow-xl overflow-hidden"
                        >
                          <button
                            role="menuitem"
                            className="w-full text-left px-3 py-2 hover:bg-white/5"
                            onClick={() => {
                              setEditing(t);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            role="menuitem"
                            className="w-full text-left px-3 py-2 text-rose-300 hover:bg-rose-500/10"
                            onClick={() => {
                              setDeletingId(t.id);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* desc */}
                {t.description ? (
                  <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{t.description}</p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-500 italic">No description</p>
                )}

                {/* meta */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <StatusBadge status={t.status} />
                  {t.dueDate && (
                    <span>
                      Due: <span className="text-zinc-300">{formatDate(t.dueDate)}</span>
                    </span>
                  )}
                  {t.assignedUser?.name && (
                    <span>
                      Assignee: <span className="text-zinc-300">{t.assignedUser.name}</span>
                    </span>
                  )}
                  {t.createdBy?.name && (
                    <span>
                      By: <span className="text-zinc-300">{t.createdBy.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Edit modal */}
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

      {/* Delete confirm */}
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
