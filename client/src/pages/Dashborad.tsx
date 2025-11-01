// import { TaskList } from "../components/TaskList";
// import { useTasks } from "../hooks/useTasks";
// import { useState } from "react";
// import { setUser } from "../services/api";

// export default function Dashboard() {
//   const [userId, setUserId] = useState(3); // Default: Admin
//   setUser(userId);

//   const { tasks, isLoading, refetch } = useTasks();

//   return (
//     <div className="p-8 space-y-6">
//       <header className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">Task Dashboard</h1>
//         <select
//           className="border p-2 rounded-md"
//           value={userId}
//           onChange={(e) => setUserId(Number(e.target.value))}
//         >
//           <option value={1}>Alice (User)</option>
//           <option value={2}>Bob (User)</option>
//           <option value={3}>Admin</option>
//         </select>
//       </header>

//       {isLoading ? (
//         <p className="text-gray-500">Loading tasks...</p>
//       ) : (
//         <TaskList tasks={tasks} onUpdated={refetch} />
//       )}
//     </div>
//   );
// }
