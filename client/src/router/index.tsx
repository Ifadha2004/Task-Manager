// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import TasksPage from "../pages/TasksPage";
import MyTasksPage from "../pages/MyTasksPage";
import NewTaskPage from "../pages/NewTaskPage";
import TaskDetailsPage from "../pages/TaskDetailsPage";
// import AdminUsersPage from "../pages/AdminUsersPage";

const NotFound = () => (
  <div className="p-6 text-zinc-300">404 — Page not found</div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      // redirect root to /tasks for cleanliness
      { index: true, element: <Navigate to="/tasks" replace /> },

      // Tasks
      { path: "tasks", element: <TasksPage /> },
      { path: "tasks/new", element: <NewTaskPage /> },
      { path: "tasks/mine", element: <MyTasksPage /> },
      // 🔹 Task details (clicking a card goes here)
      { path: "tasks/:id", element: <TaskDetailsPage /> },

      // Admin (optional)
      // { path: "admin/users", element: <AdminUsersPage /> },

      // Fallback
      { path: "*", element: <NotFound /> },
    ],
  },
]);
