// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import { taskRouter } from "./routes/taskRoutes";
// import { userRouter } from "./routes/userRoutes";
// import { authRouter } from "./routes/authRoutes";
// import { requireAuth } from "./middleware/auth";

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // public health + public auth
// app.get("/", (_req, res) => res.send("Task Manager API is running 🚀"));
// app.use("/auth", authRouter);

// // Protect all /api/* routes with withUser
// app.use("/api", requireAuth);
// app.use("/api/users", userRouter);
// app.use("/api/tasks", taskRouter);

// // Error handler
// app.use((err: any, _req: any, res: any, _next: any) => {
//   console.error(err);
//   res.status(500).json({ error: "Something went wrong!" });
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import { taskRouter } from "./routes/taskRoutes";
import { userRouter } from "./routes/userRoutes";
import { authRouter } from "./routes/authRoutes";
import { requireAuth } from "./middleware/auth";
import { adminRouter } from "./routes/adminRoutes";

const app = express();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// ✅ Express v5-compatible preflight (or delete this line entirely)
// app.options("/*", cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => res.send("Task Manager API is running 🚀"));
app.use("/auth", authRouter);

app.use("/api", requireAuth);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/admin", adminRouter);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
