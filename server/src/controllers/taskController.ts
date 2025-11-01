import { Response } from "express";
import type { AuthRequest } from "../types/express-augment";
import { prisma } from "../db";

// Helper: ownership or assignee
function isOwner(task: { createdById: number }, userId: number) {
  return task.createdById === userId;
}
function isAssignee(task: { assignedUserId: number | null }, userId: number) {
  return task.assignedUserId === userId;
}

// GET /api/tasks?status=...
export async function getAllTasks(req: AuthRequest, res: Response) {
  const { status } = req.query as { status?: "pending" | "completed" };

  const where =
    req.user!.role === "admin"
      ? (status ? { status } : {})
      : {
          OR: [{ createdById: req.user!.id }, { assignedUserId: req.user!.id }],
          ...(status ? { status } : {}),
        };

  const tasks = await prisma.task.findMany({
    where,
    include: {
      createdBy: { select: { name: true } },
      assignedUser: { select: { name: true } },
    },
    orderBy: { id: "desc" },
  });

  res.json(tasks);
}

// GET /api/tasks/mine  → ONLY tasks assigned to me
export async function getMyTasks(req: AuthRequest, res: Response) {
  const tasks = await prisma.task.findMany({
    where: { assignedUserId: req.user!.id },
    include: {
      createdBy: { select: { name: true } },
      assignedUser: { select: { name: true } },
    },
    orderBy: { id: "desc" },
  });
  res.json(tasks);
}

// GET /api/tasks/:id
export async function getTaskById(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedUser: { select: { id: true, name: true, email: true } },
    },
  });
  if (!task) return res.status(404).json({ message: "Task not found" });

  const visible =
    req.user!.role === "admin" || isOwner(task, req.user!.id) || isAssignee(task, req.user!.id);
  if (!visible) return res.status(403).json({ error: "Not allowed" });

  res.json(task);
}

// POST /api/tasks
export async function createTask(req: AuthRequest, res: Response) {
  const { title, description, dueDate, assignedUserId } = req.body as {
    title: string;
    description?: string;
    dueDate?: string;
    assignedUserId?: number | null;
  };

  if (!title) return res.status(400).json({ message: "title is required" });

  const task = await prisma.task.create({
    data: {
      title,
      description: description ?? null,
      dueDate: dueDate ? new Date(dueDate) : null,
      createdById: req.user!.id,
      assignedUserId: assignedUserId ?? null,
    },
  });

  res.status(201).json(task);
}

// PATCH /api/tasks/:id
export async function updateTask(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Task not found" });

  if (req.user!.role !== "admin" && !isOwner(existing, req.user!.id)) {
    return res.status(403).json({ error: "Not allowed to edit this task" });
  }

  const { title, description, dueDate, status } = req.body as {
    title?: string;
    description?: string;
    dueDate?: string;
    status?: "pending" | "completed";
  };

  const task = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  res.json(task);
}

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: "Task not found" });

  if (req.user!.role !== "admin" && !isOwner(existing, req.user!.id)) {
    return res.status(403).json({ error: "Not allowed to delete this task" });
  }

  await prisma.task.delete({ where: { id } });
  res.status(204).send();
};