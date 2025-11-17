// client/src/components/dev/QuickLogin.tsx
import { httpAuth } from "../../api/httpAuth";
import { auth } from "../../lib/auth";

const USERS = [
  { email: "alice@example.com", password: "password", label: "Alice" },
  { email: "bob@example.com", password: "password", label: "Bob" },
  { email: "admin@example.com", password: "password", label: "Admin" },
];

export default function QuickLogin() {
  async function loginAs(u: (typeof USERS)[number]) {
    const { data } = await httpAuth.post("/auth/login", u);
    auth.set(data.token);
    location.reload();
  }
  return (
    <select onChange={(e)=>{ const u=USERS[Number(e.target.value)]; if (u) void loginAs(u); }} defaultValue="">
      <option value="" disabled>Quick login…</option>
      {USERS.map((u,i)=><option key={u.email} value={i}>{u.label}</option>)}
    </select>
  );
}