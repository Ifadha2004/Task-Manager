// import { NavLink } from "react-router-dom";

// function Item({ to, label }: { to:string; label:string }) {
//   return (
//     <NavLink to={to} className={({isActive}) =>
//       `block px-3 py-2 rounded-lg border border-transparent hover:border-neon ${isActive ? "bg-panel border-neon text-neon" : "text-text/80"}`
//     }>{label}</NavLink>
//   );
// }
// export default function Sidebar() {
//   return (
//     <aside className="w-60 p-3 border-r border-border bg-[linear-gradient(180deg,#0b0f13,#0c1218)]">
//       <div className="space-y-1">
//         <Item to="/tasks" label="All Tasks" />
//         <Item to="/tasks/mine" label="My Tasks" />
//         <Item to="/admin/users" label="Users (Admin)" />
//       </div>
//     </aside>
//   );
// }

import { NavLink } from "react-router-dom";

function Item({ to, label, exact = false }: { to: string; label: string; exact?: boolean }) {
  return (
    <NavLink
      to={to}
      end={exact} // Only mark active when route matches exactly
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
  return (
    <aside className="w-60 p-3 border-r border-border bg-[linear-gradient(180deg,#0b0f13,#0c1218)]">
      <div className="space-y-1">
        <Item to="/tasks" label="All Tasks" exact />
        <Item to="/tasks/mine" label="My Tasks" />
      </div>
    </aside>
  );
}