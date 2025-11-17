// src/routes/authRoutes.ts
import express from "express";
import { login, register, me } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);
