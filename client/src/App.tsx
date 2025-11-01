// src/App.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
