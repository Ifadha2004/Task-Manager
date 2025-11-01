import { useState } from "react";
import { Button } from "../common/Button";

interface TaskFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : ""
  );
  const [assignedUserId, setAssignedUserId] = useState(initialData?.assignedUserId || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, dueDate, assignedUserId });
      setTitle("");
      setDescription("");
      setDueDate("");
      setAssignedUserId("");
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

      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm mb-1 text-zinc-300">Assign To (User ID)</label>
          <input
            type="number"
            className="w-full rounded-md bg-background border border-border p-2 text-sm text-text focus:border-neon focus:outline-none"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            placeholder="Optional"
          />
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
