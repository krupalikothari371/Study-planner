import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { NavLink } from "react-router-dom";

const mobileLinks = [
  { label: "Dashboard", to: "/" },
  { label: "Planner", to: "/planner" },
  { label: "Subjects", to: "/subjects" },
  { label: "Analytics", to: "/analytics" },
];

export default function TopNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isLight = theme === "light";

  return (
    <header
      className={`sticky top-0 z-10 mb-5 rounded-2xl border p-4 backdrop-blur ${
        isLight ? "border-slate-200 bg-white/90" : "border-white/10 bg-slate-900/70"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-xs uppercase tracking-[0.2em] ${isLight ? "text-slate-500" : "text-slate-400"}`}>Welcome</p>
          <h2 className={`text-lg font-semibold ${isLight ? "text-slate-900" : "text-white"}`}>{user?.name || "Student"}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`rounded-xl border px-4 py-2 text-sm font-medium ${
              isLight
                ? "border-sky-300 bg-sky-100 text-sky-800 hover:bg-sky-200"
                : "border-cyan-300/40 text-cyan-100 hover:bg-cyan-300/10"
            }`}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <button
            onClick={logout}
            className={`rounded-xl border px-4 py-2 text-sm font-medium lg:hidden ${
              isLight
                ? "border-rose-300 bg-rose-100 text-rose-700 hover:bg-rose-200"
                : "border-rose-400/30 text-rose-200 hover:bg-rose-500/15"
            }`}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
        {mobileLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${
                isActive
                  ? isLight
                    ? "bg-sky-100 text-sky-800"
                    : "bg-cyan-400/20 text-cyan-200"
                  : isLight
                    ? "bg-slate-100 text-slate-700"
                    : "bg-white/5 text-slate-300"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}
