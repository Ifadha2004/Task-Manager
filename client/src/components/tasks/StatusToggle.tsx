import { http } from "../../api/http";
import { Button } from "../common/Button";

export default function StatusToggle({
  id, status, onChange
}: {
  id: number;
  status: "pending" | "completed";
  onChange?: (next: "pending" | "completed") => void;
}) {
  const next = status === "completed" ? "pending" : "completed";
  async function handle() {
    await http.patch(`/tasks/${id}`, { status: next });
    onChange?.(next);
  }
  return (
    <Button variant={status === "completed" ? "ghost" : "primary"} onClick={handle}>
      Mark as {next}
    </Button>
  );
}
