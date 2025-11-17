import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useToast } from "../lib/toast";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { from?: Location } };
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back", { title: "Logged in" });
      nav(state?.from?.pathname || "/tasks", { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Login failed";
      toast.error(msg, { title: "Error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3 border border-border bg-panel p-6 rounded-xl">
        <h1 className="text-xl font-semibold text-text">Sign in</h1>
        <input className="w-full rounded-md bg-background border border-border p-2 text-sm text-text"
               placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-md bg-background border border-border p-2 text-sm text-text"
               placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded-md border border-neon text-neon py-2 hover:bg-neon/10">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div className="text-sm text-zinc-400">
          No account? <Link to="/register" className="text-neon">Register</Link>
        </div>
      </form>
    </div>
  );
}
