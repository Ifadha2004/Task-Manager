// server/src/routes/adminRoutes.ts
import express from "express";
import { PrismaClient, TaskStatus } from "@prisma/client";
import { requireAuth, requireAdmin } from "../middleware/auth";

const prisma = new PrismaClient();
export const adminRouter = express.Router();

// All /api/admin/* routes require authenticated admin
adminRouter.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/stats
 * High-level system stats for dashboard cards
 */
adminRouter.get("/stats", async (_req, res) => {
  const now = new Date();

  const [totalUsers, totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
    prisma.user.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: "completed" as TaskStatus } }),
    prisma.task.count({ where: { status: "pending" as TaskStatus } }),
    prisma.task.count({
      where: {
        status: "pending",
        dueDate: { lt: now },
      },
    }),
  ]);

  res.json({
    totalUsers,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
  });
});

/**
 * GET /api/admin/users/with-task-stats
 * Per-user task stats (for users table + bar chart)
 */
adminRouter.get("/users/with-task-stats", async (_req, res) => {
  // base user list
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });

  // group tasks by assignee + status
  const grouped = await prisma.task.groupBy({
    by: ["assignedUserId", "status"],
    _count: { _all: true },
    where: { assignedUserId: { not: null } },
  });

  const statsByUserId = new Map<
    number,
    { assignedTotal: number; completed: number; pending: number }
  >();

  for (const row of grouped) {
    if (row.assignedUserId == null) continue;
    const existing = statsByUserId.get(row.assignedUserId) || {
      assignedTotal: 0,
      completed: 0,
      pending: 0,
    };
    existing.assignedTotal += row._count._all;
    if (row.status === "completed") existing.completed += row._count._all;
    if (row.status === "pending") existing.pending += row._count._all;
    statsByUserId.set(row.assignedUserId, existing);
  }

  const result = users.map((u) => {
    const s = statsByUserId.get(u.id) || {
      assignedTotal: 0,
      completed: 0,
      pending: 0,
    };
    return {
      ...u,
      taskStats: s,
    };
  });

  res.json(result);
});
