import { Link } from "react-router-dom";
import { Button } from "../common/Button";
import RoleUserSwitcher from "../dev/RoleUserSwitcher";

export default function Topbar() {
  return (
    <header className="h-14 border-b border-border bg-panel flex items-center justify-between px-4">
      <div className="font-semibold tracking-wide">
        <span className="text-neon">●</span> Task Manager
      </div>

      <div className="flex items-center gap-3">
        <Link to="/tasks/new">
          {/* outlined neon, no solid background; soft neon on hover */}
          <Button variant="outlineNeon" aria-label="Add Task">
            + New Task
          </Button>
        </Link>

        <RoleUserSwitcher />
      </div>
    </header>
  );
}
