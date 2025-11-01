export type Role = "user" | "admin";
export type TaskStatus = "pending" | "completed";

export type User = { id: number; name: string; email: string; role: Role };

export type Task = {
  id: number; title: string; description?: string | null;
  status: TaskStatus; dueDate?: string | null;
  createdById: number; assignedUserId?: number | null;
  createdAt: string; updatedAt: string;
  createdBy?: Pick<User,"id"|"name"|"email">;
  assignedUser?: Pick<User,"id"|"name"|"email"> | null;
};
