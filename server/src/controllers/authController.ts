// src/controllers/authController.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { signToken, AuthedRequest } from "../middleware/auth";

const prisma = new PrismaClient();

const PUBLIC_USER = {
  id: true,
  name: true,
  email: true,
  role: true,
  active: true,
  createdAt: true,
};

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email and password are required" });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hash },
    select: PUBLIC_USER,
  });

  const token = signToken(user);
  return res.status(201).json({ user, token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "email and password required" });
  }

  // 🔸 Explicitly select fields so TS knows `active` exists
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      active: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // 🚫 Block disabled (inactive) accounts
  if (user.active === false) {
    return res.status(403).json({
      error: "Account disabled. Contact admin.",
    });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    createdAt: user.createdAt,
  };

  const token = signToken(safeUser);
  return res.json({ user: safeUser, token });
}

/** Return the current user (for bootstrapping the client) */
export async function me(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Unauthenticated" });
  return res.json({ user: req.user });
}
