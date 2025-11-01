import Modal from "../common/Modal";
import TaskForm from "../tasks/TaskForm";
import { http } from "../../api/http";

export default function EditTaskModal({
  open, onClose, task, onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  task: {
    id: number; title: string; description?: string | null;
    dueDate?: string | null; assignedUser?: { id: number | null } | null;
  };
  onUpdated?: () => Promise<void> | void;
}) {
  if (!open) return null;

  // Normalize initial data for TaskForm
  const initialData = {
    title: task.title,
    description: task.description ?? "",
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    assignedUserId: task.assignedUser?.id ?? "",
  };

  async function handleSubmit(data: any) {
    await http.patch(`/tasks/${task.id}`, {
      title: data.title,
      description: data.description || null,
      dueDate: data.dueDate || null,
    });
    await onUpdated?.();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <TaskForm initialData={initialData} onSubmit={handleSubmit} onCancel={onClose}/>
    </Modal>
  );
}
