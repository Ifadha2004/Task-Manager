// import { Link } from "react-router-dom";
// import { Button } from "../common/Button";

// export default function Topbar() {
//   return (
//     <header className="h-14 border-b border-border bg-panel flex items-center justify-between px-4">
//       <div className="font-semibold tracking-wide">
//         <span className="text-neon">●</span> Task Manager
//       </div>

//       <div className="flex items-center gap-3">
//         {/* Optional: show QuickLogin only in dev (if you kept it) */}
//         {/* {import.meta.env.DEV ? <QuickLogin /> : null} */}
//       </div>
//     </header>
//   );
// }


// client/src/components/layout/Topbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../common/Button";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();                        // clears sessionStorage + user state
    navigate("/login", { replace: true });
  }

  return (
    <header className="h-14 border-b border-border bg-panel flex items-center justify-between px-4">
      <div className="font-semibold tracking-wide">
        <span className="text-neon">●</span> Task Manager
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-zinc-400">
            {user.name ?? user.email}
          </span>
        )}

        <Link to="/tasks/new">
          <Button variant="outlineNeon" aria-label="Add Task">
            + New Task
          </Button>
        </Link>

        {user && (
          <Button variant="ghost" onClick={handleLogout}>
            Log out
          </Button>
        )}
      </div>
    </header>
  );
}
