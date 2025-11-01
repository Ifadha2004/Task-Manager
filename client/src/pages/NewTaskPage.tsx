import TaskForm from "../components/tasks/TaskForm";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";
import { useToast } from "../lib/toast";

export default function NewTaskPage() {
  const navigate = useNavigate();
  const toast = useToast();

  async function handleCreate(data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: string | number;
  }) {
    const payload = {
      ...data,
      assignedUserId:
        data.assignedUserId === "" || data.assignedUserId === undefined
          ? null
          : Number(data.assignedUserId),
    };

    try {
      await http.post("/tasks", payload);
      toast.success("Task created", { title: "Success" });
      navigate("/tasks");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error";
      toast.error(`Failed to create task: ${msg}`, { title: "Error" });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">
          <span className="text-neon">+</span> New Task
        </h1>
      </div>
      <TaskForm onSubmit={handleCreate} />
    </div>
  );
}
