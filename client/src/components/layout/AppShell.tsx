import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppShell() {
  return (
    <div className="h-screen grid grid-rows-[auto,1fr]">
      <Topbar />
      <div className="grid grid-cols-[240px,1fr]">
        <Sidebar />
        <main className="p-5 bg-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
