// client/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./lib/toast";
import { DebugErrorBoundary } from "./DebugErrorBoundary";

window.addEventListener("unhandledrejection", (e) => {
  console.error("[UNHANDLED REJECTION]", e?.reason ?? e);
});
window.addEventListener("error", (e: any) => {
  console.error("[WINDOW ERROR]", e?.error ?? e?.message ?? e);
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <DebugErrorBoundary>
            <RouterProvider router={router} />
          </DebugErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
