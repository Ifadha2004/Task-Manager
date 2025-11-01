// src/middleware/auth.ts
// import type { Response, NextFunction } from "express";
// import type { AuthRequest } from "../types/express-augment";
// import { prisma } from "../db";

// export async function withUser(req: AuthRequest, res: Response, next: NextFunction) {
//   try {
//     const idHeader = req.header("X-USER-ID");
//     if (!idHeader) return res.status(401).json({ error: "Missing X-USER-ID header" });

//     const id = Number(idHeader);
//     if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid X-USER-ID" });

//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: { id: true, name: true, email: true, role: true },
//     });
//     if (!user) return res.status(401).json({ error: "User not found" });

//     req.user = user;            
//     next();
//   } catch (e) {
//     next(e);
//   }
// }

import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Augment Request with authenticated user */
export type AuthedRequest = Request & {
  user?: { id: number; name: string | null; email: string | null; role: "admin" | "user" };
};

/** Attach req.user from X-USER-ID header */
export async function withUser(req: Request, res: Response, next: NextFunction) {
  try {
    const raw = req.header("X-USER-ID");
    if (!raw) return res.status(400).json({ error: "Missing X-USER-ID header" });

    const id = Number(raw);
    if (!Number.isFinite(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid X-USER-ID header" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    (req as AuthedRequest).user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user.role as "admin" | "user") ?? "user",
    };
    next();
  } catch (err) {
    next(err);
  }
}

/** Guard for admin-only endpoints */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as AuthedRequest).user;
  if (!u) return res.status(401).json({ error: "Unauthenticated" });
  if (u.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}
