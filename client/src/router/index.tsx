// client/src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import TasksPage from "../pages/TasksPage";
import MyTasksPage from "../pages/MyTasksPage";
import NewTaskPage from "../pages/NewTaskPage";
import TaskDetailsPage from "../pages/TaskDetailsPage";
import ProtectedRoute from "../router/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Health from "../pages/Health"; 

export const router = createBrowserRouter([
  // public
  { path: "/health", element: <Health /> }, 
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  // protected
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <TasksPage /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "tasks/new", element: <NewTaskPage /> },
          { path: "tasks/:id", element: <TaskDetailsPage /> },
          { path: "tasks/mine", element: <MyTasksPage /> },
        ],
      },
    ],
  },

  // fallback
  { path: "*", element: <Navigate to="/login" replace /> },
]);
