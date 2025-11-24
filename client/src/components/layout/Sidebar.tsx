// client/src/components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Item({ to, label, exact = false }: { to: string; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg border border-transparent hover:border-neon ${
          isActive ? "bg-panel border-neon text-neon" : "text-text/80"
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-60 p-3 border-r border-border bg-[linear-gradient(180deg,#0b0f13,#0c1218)]">
      <div className="space-y-1">
        <Item to="/tasks" label="All Tasks" exact />
        <Item to="/tasks/mine" label="My Tasks" />
      </div>

      {/* Admin-only section */}
      {user?.role === "admin" && (
        <div className="mt-6 pt-4 border-t border-border space-y-1">
          <div className="text-xs uppercase tracking-wider text-zinc-500 px-3 mb-1">Admin</div>
          <Item to="/admin/dashboard" label="Dashboard" />
          <Item to="/admin/users" label="Manage Users" />
        </div>
      )}
    </aside>
  );
}
