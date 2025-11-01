import TaskForm from "../components/tasks/TaskForm";
import { http } from "../api/http";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../lib/toast";

export default function NewTaskPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();

  // string | null -> default to "" so the input is empty when not provided
  const defaultAssignee = params.get("assignee") ?? "";

  // NOTE: include `null` so it matches TaskForm's onSubmit signature
  async function handleCreate(data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: string | number | null;
  }) {
    const payload = {
      ...data,
      assignedUserId:
        data.assignedUserId === "" || data.assignedUserId === undefined || data.assignedUserId === null
          ? null
          : Number(data.assignedUserId),
    };

    try {
      await http.post("/tasks", payload);
      toast.success("Task created", { title: "Success" });
      navigate("/tasks");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Unknown error";
      toast.error(msg, { title: "Create failed" });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-text">
          <span className="text-neon">+</span> New Task
        </h1>
      </div>

      <TaskForm
        onSubmit={handleCreate}
        defaultAssignedUserId={defaultAssignee}
      />
    </div>
  );
}
