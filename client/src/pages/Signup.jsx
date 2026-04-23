import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-auth px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl border border-white/15 bg-slate-900/75 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Optimal Study Plan Generator</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Create Account</h1>

        <div className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />
          <input
            type="password"
            placeholder="Password"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-cyan-300"
          />
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="mt-4 text-sm text-slate-300">
          Already registered? <Link to="/login" className="text-cyan-300">Login</Link>
        </p>
      </form>
    </div>
  );
}
