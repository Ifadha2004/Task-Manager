import Modal from "../common/Modal";
import { Button } from "../common/Button";

export default function ConfirmDialog({
  open, title = "Confirm", message, onCancel, onConfirm, confirmLabel = "Confirm"
}: {
  open: boolean;
  title?: string;
  message: string | React.ReactNode;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}) {
  if (!open) return null;
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-zinc-300">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={() => void onConfirm()}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
