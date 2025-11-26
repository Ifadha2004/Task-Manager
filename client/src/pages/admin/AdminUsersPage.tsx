// // client/src/pages/admin/AdminUsersPage.tsx
// import { Navigate, Link } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useUsers } from "../../hooks/useUsers";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { http } from "../../api/http";
// import { useToast } from "../../lib/toast";
// import type { User } from "../../lib/types";
// import { formatDate } from "../../lib/format";

// export default function AdminUsersPage() {
//   const { user } = useAuth();
//   const toast = useToast();
//   const queryClient = useQueryClient();

//   // Client-side guard – real security is on the server, this is UX
//   if (user?.role !== "admin") {
//     return <Navigate to="/tasks" replace />;
//   }

//   const { data, isLoading, isError } = useUsers(true);

//   const roleMutation = useMutation({
//     mutationFn: async ({ id, role }: { id: number; role: "admin" | "user" }) => {
//       const { data } = await http.patch<User>(`/users/${id}/role`, { role });
//       return data;
//     },
//     onSuccess: (updated) => {
//       // Refresh users list
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//       toast.success(`Role updated to ${updated.role}`, {
//         title: updated.name || "User updated",
//       });
//     },
//     onError: (err: any) => {
//       const msg =
//         err?.response?.data?.error ||
//         err?.response?.data?.message ||
//         "Failed to update role";
//       toast.error(msg, { title: "Update failed" });
//     },
//   });

//   function handleRoleChange(u: User, nextRole: "admin" | "user") {
//     if (u.role === nextRole) return;
//     roleMutation.mutate({ id: u.id, role: nextRole });
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-semibold text-text">Manage Users</h1>
//           <p className="text-sm text-zinc-400">
//             View all users, their roles, and promote or demote admins.
//           </p>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="rounded-xl border border-border bg-panel p-4 md:p-6">
//         {isLoading && (
//           <div className="text-zinc-300 text-sm">Loading users…</div>
//         )}

//         {isError && (
//           <div className="text-sm text-rose-300">
//             Failed to load users. Please try again.
//           </div>
//         )}

//         {!isLoading && !isError && (!data || data.length === 0) && (
//           <div className="text-sm text-zinc-300">No users found.</div>
//         )}

//         {!isLoading && !isError && data && data.length > 0 && (
//           <div className="overflow-x-auto">
//             <table className="min-w-full text-sm">
//               <thead>
//                 <tr className="text-left text-zinc-400 border-b border-border">
//                   <th className="py-2 pr-4">Name</th>
//                   <th className="py-2 pr-4">Email</th>
//                   <th className="py-2 pr-4">Role</th>
//                   <th className="py-2 pr-4">Created</th>
//                   <th className="py-2 pr-4">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((u) => (
//                   <tr
//                     key={u.id}
//                     className="border-b border-border/60 hover:bg-white/5 transition-colors"
//                   >
//                     <td className="py-2 pr-4 text-zinc-100">
//                       {u.name || <span className="text-zinc-500 italic">No name</span>}
//                     </td>
//                     <td className="py-2 pr-4 text-zinc-300">{u.email}</td>
//                     <td className="py-2 pr-4">
//                       <select
//                         value={u.role}
//                         disabled={roleMutation.isPending}
//                         onChange={(e) =>
//                           handleRoleChange(
//                             u,
//                             e.target.value as "admin" | "user"
//                           )
//                         }
//                         className="rounded-md border border-border bg-background px-2 py-1 text-xs text-zinc-200 focus:border-neon focus:outline-none"
//                       >
//                         <option value="user">User</option>
//                         <option value="admin">Admin</option>
//                       </select>
//                     </td>
//                     <td className="py-2 pr-4 text-zinc-400">
//                       {u.createdAt ? formatDate(u.createdAt as any) : "—"}
//                     </td>
//                     <td className="py-2 pr-4 text-xs">
//                       <Link
//                         to={`/admin/users/${u.id}/tasks`}
//                         className="text-neon underline underline-offset-2"
//                       >
//                         View tasks
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// client/src/pages/admin/AdminUsersPage.tsx
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../api/http";
import { useToast } from "../../lib/toast";
import type { User } from "../../lib/types";
import { formatDate } from "../../lib/format";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Client-side guard – real security is on the server, this is UX
  if (user?.role !== "admin") {
    return <Navigate to="/tasks" replace />;
  }

  const { data, isLoading, isError } = useUsers(true);

  // --- Role update mutation ---
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: "admin" | "user" }) => {
      const { data } = await http.patch<User>(`/users/${id}/role`, { role });
      return data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Role updated to ${updated.role}`, {
        title: updated.name || "User updated",
      });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update role";
      toast.error(msg, { title: "Update failed" });
    },
  });

  // --- Status (active/disabled) mutation ---
  const statusMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number; active: boolean }) => {
      const { data } = await http.patch<User>(`/users/${id}/status`, { active });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to update status";
      toast.error(msg, { title: "Status update failed" });
    },
  });

  // --- Delete user mutation ---
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await http.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to delete user";
      toast.error(msg, { title: "Delete failed" });
    },
  });

  function handleRoleChange(u: User, nextRole: "admin" | "user") {
    if (u.role === nextRole) return;
    roleMutation.mutate({ id: u.id, role: nextRole });
  }

  function handleStatusToggle(u: User) {
    // default active === true if missing
    const next = !(u.active ?? true);
    statusMutation.mutate({ id: u.id, active: next });
  }

  function handleDelete(u: User) {
    if (!window.confirm(`Delete user ${u.email}? This cannot be undone.`)) return;
    deleteMutation.mutate(u.id);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">Manage Users</h1>
          <p className="text-sm text-zinc-400">
            View all users, their roles, and promote, disable, or remove accounts.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border bg-panel p-4 md:p-6">
        {isLoading && (
          <div className="text-zinc-300 text-sm">Loading users…</div>
        )}

        {isError && (
          <div className="text-sm text-rose-300">
            Failed to load users. Please try again.
          </div>
        )}

        {!isLoading && !isError && (!data || data.length === 0) && (
          <div className="text-sm text-zinc-300">No users found.</div>
        )}

        {!isLoading && !isError && data && data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-zinc-400 border-b border-border">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Created</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border/60 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-2 pr-4 text-zinc-100">
                      {u.name || (
                        <span className="text-zinc-500 italic">No name</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-zinc-300">{u.email}</td>

                    {/* Role select */}
                    <td className="py-2 pr-4">
                      <select
                        value={u.role}
                        disabled={roleMutation.isPending}
                        onChange={(e) =>
                          handleRoleChange(
                            u,
                            e.target.value as "admin" | "user"
                          )
                        }
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs text-zinc-200 focus:border-neon focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    {/* Status toggle */}
                    <td className="py-2 pr-4">
                      <button
                        onClick={() => handleStatusToggle(u)}
                        disabled={
                          statusMutation.isPending || deleteMutation.isPending
                        }
                        className={`px-2 py-1 rounded-full text-xs border ${
                          u.active ?? true
                            ? "border-emerald-500/60 text-emerald-300 bg-emerald-500/10"
                            : "border-zinc-600 text-zinc-400 bg-zinc-800"
                        }`}
                      >
                        {u.active ?? true ? "Active" : "Disabled"}
                      </button>
                    </td>

                    {/* Created at */}
                    <td className="py-2 pr-4 text-zinc-400">
                      {u.createdAt ? formatDate(u.createdAt as any) : "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-2 pr-4 flex gap-2 text-xs">
                      <Link
                        to={`/admin/users/${u.id}/tasks`}
                        className="text-neon underline underline-offset-2"
                      >
                        View tasks
                      </Link>
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={
                          deleteMutation.isPending || u.id === user?.id
                        }
                        className="text-rose-400 hover:text-rose-300 disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
