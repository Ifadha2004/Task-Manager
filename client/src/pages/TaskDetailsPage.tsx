// import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { http } from "../api/http";
// import { formatDate } from "../lib/format";
// import StatusBadge from "../components/tasks/StatusBadge";
// import Spinner from "../components/common/Spinner";
// import { Button } from "../components/common/Button";
// import ConfirmDialog from "../components/common/ConfirmDialog";
// import EditTaskModal from "../components/tasks/EditTaskModal";
// import StatusToggle from "../components/tasks/StatusToggle";
// import { useToast } from "../lib/toast"; 

// type Task = {
//   id: number;
//   title: string;
//   description?: string | null;
//   status: "pending" | "completed";
//   dueDate?: string | null;
//   createdBy?: { id: number; name: string | null; email: string | null } | null;
//   assignedUser?: { id: number | null; name: string | null; email: string | null } | null;
// };

// export default function TaskDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [task, setTask] = useState<Task | null>(null);

//   const [showEdit, setShowEdit] = useState(false);
//   const [showDelete, setShowDelete] = useState(false);

//   const toast = useToast();

//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await http.get<Task>(`/tasks/${id}`);
//       setTask(data);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     let cancel = false;
//     (async () => {
//       setLoading(true);
//       try {
//         const { data } = await http.get<Task>(`/tasks/${id}`);
//         if (!cancel) setTask(data);
//       } catch {
//         if (!cancel) setTask(null);
//       } finally {
//         if (!cancel) setLoading(false);
//       }
//     })();
//     return () => {
//       cancel = true;
//     };
//   }, [id]);

//   async function handleDelete() {
//     if (!task) return;
//     if (!confirm("Delete this task?")) return;
//     await http.delete(`/tasks/${task.id}`);
//     toast.success("Task deleted", { title: "Removed" }); 
//     navigate("/tasks");
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center gap-2 text-zinc-300">
//         <Spinner />
//         <span>Loading…</span>
//       </div>
//     );
//   }

//   if (!task) {
//     return <div className="text-zinc-300">Task not found or not accessible.</div>;
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <h1 className="text-2xl font-semibold text-text">{task.title}</h1>
//           <StatusBadge status={task.status} />
//         </div>
//         <div className="flex gap-2">
//           <StatusToggle id={task.id} status={task.status} onChange={() => void load()} />
//           <Button variant="ghost" onClick={() => setShowEdit(true)}>
//             Edit
//           </Button>
//           <Button variant="danger" onClick={() => setShowDelete(true)}>
//             Delete
//           </Button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="rounded-xl border border-border bg-panel p-5 space-y-4">
//         <div className="text-zinc-300">
//           <span className="text-zinc-400">Description:</span>{" "}
//           {task.description || <em className="text-zinc-500">No description</em>}
//         </div>

//         <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
//           {task.dueDate && (
//             <div>
//               <span className="text-zinc-400">Due:</span> {formatDate(task.dueDate)}
//             </div>
//           )}
//           {task.assignedUser?.name && (
//             <div>
//               <span className="text-zinc-400">Assignee:</span> {task.assignedUser.name}
//             </div>
//           )}
//           {task.createdBy?.name && (
//             <div>
//               <span className="text-zinc-400">Created by:</span> {task.createdBy.name}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Edit Modal */}
//       <EditTaskModal
//         open={showEdit}
//         onClose={() => setShowEdit(false)}
//         task={task}
//         onUpdated={() => load()}
//       />

//       {/* Delete Confirm */}
//       <ConfirmDialog
//         open={showDelete}
//         title="Delete Task"
//         message="This action cannot be undone. Are you sure you want to delete this task?"
//         confirmLabel="Delete"
//         onCancel={() => setShowDelete(false)}
//         onConfirm={async () => handleDelete()}
//       />
//     </div>
//   );
// }


// src/pages/TaskDetailsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../api/http";
import { formatDate } from "../lib/format";
import StatusBadge from "../components/tasks/StatusBadge";
import Spinner from "../components/common/Spinner";
import { Button } from "../components/common/Button";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EditTaskModal from "../components/tasks/EditTaskModal";
import StatusToggle from "../components/tasks/StatusToggle";
import { useToast } from "../lib/toast";

type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: "pending" | "completed";
  dueDate?: string | null;
  createdBy?: { id: number; name: string | null; email: string | null } | null;
  assignedUser?: { id: number | null; name: string | null; email: string | null } | null;
};

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);

  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await http.get<Task>(`/tasks/${id}`);
      setTask(data);
    } catch (e: any) {
      setTask(null);
      toast.error(e?.response?.data?.error ?? "Failed to load task", { title: "Error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDelete() {
    if (!task) return;
    try {
      await http.delete(`/tasks/${task.id}`);
      setShowDelete(false);
      toast.success("Task deleted", { title: "Removed" });
      navigate("/tasks");
    } catch (e: any) {
      toast.error(e?.response?.data?.error ?? "Failed to delete task", { title: "Error" });
    }
  }

  // If your <StatusToggle/> calls the API itself and returns the next status
  // via onChange(nextStatus), we optimistically update + toast.
  // If it doesn't pass a value, we fall back to reloading then toast.
  async function handleStatusChange(next?: "pending" | "completed") {
    if (next) {
      setTask((prev) => (prev ? { ...prev, status: next } : prev));
      toast.success(next === "completed" ? "Marked as completed" : "Marked as pending");
    } else {
      await load();
      toast.success("Status updated");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-zinc-300">
        <Spinner />
        <span>Loading…</span>
      </div>
    );
  }

  if (!task) {
    return <div className="text-zinc-300">Task not found or not accessible.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-text">{task.title}</h1>
          <StatusBadge status={task.status} />
        </div>
        <div className="flex gap-2">
          <StatusToggle id={task.id} status={task.status} onChange={handleStatusChange} />
          <Button variant="ghost" onClick={() => setShowEdit(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="rounded-xl border border-border bg-panel p-5 space-y-4">
        <div className="text-zinc-300">
          <span className="text-zinc-400">Description:</span>{" "}
          {task.description || <em className="text-zinc-500">No description</em>}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-zinc-300">
          <div>
            <span className="text-zinc-400">Due:</span>{" "}
            {task.dueDate ? formatDate(task.dueDate) : <em className="text-zinc-500">No due date</em>}
          </div>
          {task.assignedUser?.name && (
            <div>
              <span className="text-zinc-400">Assignee:</span> {task.assignedUser.name}
            </div>
          )}
          {task.createdBy?.name && (
            <div>
              <span className="text-zinc-400">Created by:</span> {task.createdBy.name}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditTaskModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        task={task}
        onUpdated={async () => {
          setShowEdit(false);
          toast.success("Task updated", { title: "Saved" });
          await load();
        }}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={showDelete}
        title="Delete Task"
        message="This action cannot be undone. Are you sure you want to delete this task?"
        confirmLabel="Delete"
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
