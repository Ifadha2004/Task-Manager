import { useState } from "react";
import { Check } from "lucide-react";
import { http } from "../../api/http";
import { useToast } from "../../lib/toast";

interface Props {
  id: number;
  status: "pending" | "completed";
  onChange?: () => void;
}

export default function StatusToggle({ id, status, onChange }: Props) {
  const [isCompleted, setIsCompleted] = useState(status === "completed");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleToggle() {
    if (loading) return;
    setLoading(true);

    // optimistic UI
    const next = !isCompleted;
    setIsCompleted(next);

    try {
      const newStatus = next ? "completed" : "pending";
      await http.patch(`/tasks/${id}`, { status: newStatus }); // <<<<<< FIXED
      toast.success(next ? "Task marked as completed" : "Task set to pending");
      onChange?.();
    } catch (e) {
      // revert optimistic UI on failure
      setIsCompleted(!next);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full border transition-all duration-200",
        isCompleted
          ? "bg-emerald-500/80 hover:bg-emerald-400/80 border-emerald-500"
          : "bg-zinc-700 hover:bg-zinc-600 border-zinc-600",
      ].join(" ")}
      aria-label="Toggle task status"
    >
      <span
        className={[
          "absolute left-0.5 top-0.5 h-4 w-4 rounded-full transition-all duration-200 flex items-center justify-center",
          isCompleted
            ? "translate-x-4 bg-white text-emerald-600"
            : "translate-x-0 bg-zinc-300 text-transparent",
        ].join(" ")}
      >
        <Check className="h-3 w-3" />
      </span>
    </button>
  );
}
