import type { Request } from "express";
import type { Role } from "@prisma/client";

// export type AuthUser = {
//   id: number;
//   name: string;
//   email: string;
//   role: Role; // "user" | "admin"
// };

// export type AuthRequest = Request & { user?: AuthUser };

export type Role = "admin" | "user";

export interface AuthUser {
  id: number;
  role: Role;
  name?: string | null;
  email?: string | null;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}