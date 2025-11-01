import { USER_ID_KEY } from "../../api/http";

const USERS = [
  { id: 1, label: "Alice (user#1)" },
  { id: 2, label: "Bob (user#2)" },
  { id: 3, label: "Admin (admin#3)" },
];

export default function RoleUserSwitcher() {
  const current = Number(localStorage.getItem(USER_ID_KEY) ?? 3);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    localStorage.setItem(USER_ID_KEY, e.target.value);
    window.dispatchEvent(new Event("tm:user-switch"));
    location.reload();
  };
  return (
    <select onChange={onChange} defaultValue={current} className="bg-panel border border-border text-sm rounded-lg px-2 py-1">
      {USERS.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
    </select>
  );
}
