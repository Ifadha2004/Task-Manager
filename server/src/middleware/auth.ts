// import type { Request, Response, NextFunction } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// /** Augment Request with authenticated user */
// export type AuthedRequest = Request & {
//   user?: { id: number; name: string | null; email: string | null; role: "admin" | "user" };
// };

// /** Attach req.user from X-USER-ID header */
// export async function withUser(req: Request, res: Response, next: NextFunction) {
//   try {
//     const raw = req.header("X-USER-ID");
//     if (!raw) return res.status(400).json({ error: "Missing X-USER-ID header" });

//     const id = Number(raw);
//     if (!Number.isFinite(id) || id <= 0) {
//       return res.status(400).json({ error: "Invalid X-USER-ID header" });
//     }

//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) return res.status(404).json({ error: "User not found" });

//     (req as AuthedRequest).user = {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: (user.role as "admin" | "user") ?? "user",
//     };
//     next();
//   } catch (err) {
//     next(err);
//   }
// }

// /** Guard for admin-only endpoints */
// export function requireAdmin(req: Request, res: Response, next: NextFunction) {
//   const u = (req as AuthedRequest).user;
//   if (!u) return res.status(401).json({ error: "Unauthenticated" });
//   if (u.role !== "admin") return res.status(403).json({ error: "Admin only" });
//   next();
// }


import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";             
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = process.env.JWT_EXPIRES ?? "7d";

export type JwtUser = { id: number; role: Role; email: string; name: string | null };
export type AuthedRequest = Request & { user?: JwtUser };

export function signToken(user: { id: number; role: Role; email: string; name: string | null }) {
  // jwt.sign(payload, secret, options) — with types from @types/jsonwebtoken
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

/** Require a valid Bearer token, attach req.user */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.header("Authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Missing Authorization header" });

    const payload = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(401).json({ error: "User no longer exists" });

    (req as AuthedRequest).user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

/** Admin guard (stack after requireAuth) */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const u = (req as AuthedRequest).user;
  if (!u) return res.status(401).json({ error: "Unauthenticated" });
  if (u.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}
