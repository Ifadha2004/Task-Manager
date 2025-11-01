import Modal from "../common/Modal";
import TaskForm from "../tasks/TaskForm";
import { http } from "../../api/http";
import { useToast } from "../../lib/toast";

type MinimalTaskForEdit = {
  id: number;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  // accept either id or just name (or both) so it works with TaskCard and full Task
  assignedUser?: { id?: number | null; name?: string | null } | null;
  createdBy?: { id?: number | null; name?: string | null } | null;
  status?: "pending" | "completed";
};

export default function EditTaskModal({
  open,
  onClose,
  task,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  task: MinimalTaskForEdit;
  onUpdated?: () => Promise<void> | void;
}) {
  const toast = useToast();
  if (!open) return null;

  // Normalize initial data for TaskForm
  const initialData = {
    title: task.title,
    description: task.description ?? "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    // If we got only a name (from TaskCard), this will be "", which TaskForm treats as "no assignee"
    assignedUserId:
      typeof task.assignedUser?.id === "number" || task.assignedUser?.id === null
        ? task.assignedUser?.id ?? ""
        : "",
  };

  async function handleSubmit(data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: number | string;
  }) {
    await http.patch(`/tasks/${task.id}`, {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
      // (Optional) if your PATCH supports reassignment, keep this:
      // assignedUserId:
      //   data.assignedUserId === "" || data.assignedUserId === undefined
      //     ? null
      //     : Number(data.assignedUserId),
    });
    toast.success("Task updated", { title: "Saved" });
    await onUpdated?.();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <TaskForm initialData={initialData} onSubmit={handleSubmit} onCancel={onClose} />
    </Modal>
  );
}
