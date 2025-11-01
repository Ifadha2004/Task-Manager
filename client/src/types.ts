export type TaskStatus = "pending" | "completed";

export interface UserLite {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null;
  createdById: number;
  assignedUserId?: number | null;
  createdBy?: UserLite;
  assignedUser?: UserLite | null;
}
