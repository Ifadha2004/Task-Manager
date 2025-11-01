import express from "express";
import cors from "cors";
import morgan from "morgan";
import { taskRouter } from "./routes/taskRoutes";
import { userRouter } from "./routes/userRoutes";
import { withUser } from "./middleware/auth";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Public health
app.get("/", (_req, res) => res.send("Task Manager API is running 🚀"));

// Protect all /api/* routes with withUser
app.use("/api", withUser);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
