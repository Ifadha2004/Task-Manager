import { useEffect, useState } from "react";
import { Button } from "../common/Button";
import { http } from "../../api/http";

type UserLite = { id: number; name: string | null; email: string | null };

interface TaskFormProps {
  initialData?: {
    title?: string;
    description?: string | null;
    dueDate?: string | null;
    assignedUserId?: number | null;
  };
  onSubmit: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: number | null;
  }) => Promise<void>;
  onCancel?: () => void;
  /** optionally preselect an assignee (e.g., from ?assignee=) */
  defaultAssignedUserId?: string | number;
}

export default function TaskForm({
  initialData,
  onSubmit,
  onCancel,
  defaultAssignedUserId,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  );

  // 🔹 select state uses string to allow "" (Optional). Convert to number | null on submit.
  const [assignedUserId, setAssignedUserId] = useState<string>(
    (initialData?.assignedUserId ?? defaultAssignedUserId ?? "") as any
  );

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserLite[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    // keep defaultAssignedUserId in sync
    if (defaultAssignedUserId != null && defaultAssignedUserId !== "") {
      setAssignedUserId(String(defaultAssignedUserId));
    }
  }, [defaultAssignedUserId]);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setUsersLoading(true);
      try {
        const { data } = await http.get<UserLite[]>("/users/lite");
        if (!cancel) setUsers(data ?? []);
      } catch (_e) {
        if (!cancel) setUsers([]);
      } finally {
        if (!cancel) setUsersLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        title,
        description: description || undefined,
        dueDate: dueDate || undefined,
        assignedUserId:
          assignedUserId === "" || assignedUserId == null
            ? null
            : Number(assignedUserId),
      });
      // reset only when creating
      if (!initialData) {
        setTitle("");
        setDescription("");
        setDueDate("");
        setAssignedUserId("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-panel border border-border rounded-xl p-6"
    >
      <div>
        <label className="block text-sm mb-1 text-zinc-300">Title</label>
        <input
          type="text"
          className="w-full rounded-md bg-background border border-border p-2 text-sm text-text focus:border-neon focus:outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-zinc-300">Description</label>
        <textarea
          className="w-full rounded-md bg-background border border-border p-2 text-sm text-text focus:border-neon focus:outline-none"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1 text-zinc-300">Due Date</label>
          <input
            type="date"
            className="w-full rounded-md bg-background border border-border p-2 text-sm text-text focus:border-neon focus:outline-none"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-zinc-300">Assign To</label>
          <select
            className="w-full rounded-md bg-background border border-border p-2 text-sm text-text focus:border-neon focus:outline-none"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            disabled={usersLoading}
          >
            <option value="">Optional</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name ?? "Unnamed"}{u.email ? ` (${u.email})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
