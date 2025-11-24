import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth"; // ✅ JWT middlewares
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
export const userRouter = express.Router();

// Protect the whole router
userRouter.use(requireAuth);

/**
 * GET /api/users
 * Admin-only: full list of users
 */
userRouter.get("/", requireAdmin, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { id: "asc" },
  });
  res.json(users);
});

/**
 * GET /api/users/lite
 * Authenticated: minimal user list for dropdowns (assigning tasks, etc.)
 */
userRouter.get("/lite", async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
  res.json(users);
});

/**
 * GET /api/users/:id
 * Admin-only: single user details
 */
userRouter.get("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: "Not found" });
  res.json(user);
});

/**
 * PATCH /api/users/:id/role
 * Admin-only: promote/demote between "user" and "admin"
 */
userRouter.patch("/:id/role", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const { role } = req.body as { role?: Role | string };
  if (role !== "admin" && role !== "user") {
    return res.status(400).json({ error: "role must be 'admin' or 'user'" });
  }

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ error: "User not found" });

  // Optional safety: don't demote the last admin
  if (existing.role === "admin" && role === "user") {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });
    if (adminCount <= 1) {
      return res.status(400).json({ error: "Cannot demote the last admin" });
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: role as Role },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  res.json(updated);
});

userRouter.get("/:id/tasks", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const tasks = await prisma.task.findMany({
    where: {
      OR: [{ createdById: id }, { assignedUserId: id }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      assignedUser: { select: { id: true, name: true, email: true } },
    },
  });

  res.json(tasks);
});