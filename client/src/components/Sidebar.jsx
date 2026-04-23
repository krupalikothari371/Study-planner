import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

const links = [
  { label: "Dashboard", to: "/" },
  { label: "Study Planner", to: "/planner" },
  { label: "Subjects", to: "/subjects" },
  { label: "Analytics", to: "/analytics" },
  { label: "History", to: "/history" },
  { label: "Settings", to: "/settings" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <aside
      className={`fixed left-0 top-0 z-20 hidden h-screen w-64 border-r p-5 backdrop-blur lg:block ${
        isLight ? "border-slate-200 bg-white/95" : "border-white/10 bg-slate-950/80"
      }`}
    >
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Optimal</p>
        <h1 className={`mt-2 text-2xl font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>Study Planner</h1>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm transition ${
                isActive
                  ? isLight
                    ? "border border-sky-200 bg-sky-100 text-sky-800"
                    : "bg-cyan-400/20 text-cyan-200"
                  : isLight
                    ? "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className={`mt-8 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          isLight
            ? "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200"
            : "border-rose-400/30 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
        }`}
      >
        Logout
      </button>
    </aside>
  );
}
