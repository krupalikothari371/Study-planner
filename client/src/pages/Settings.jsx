import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import api from "../services/api";

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/auth/profile", { name });
      setUser(data);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put("/auth/change-password", passwordForm);
      toast.success("Password changed");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  };

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Theme Settings</h3>
        <p className="mt-2 text-sm text-slate-300">Current theme: {theme}</p>
        <button onClick={toggleTheme} className="mt-4 rounded-xl border border-cyan-300/40 px-4 py-2 text-cyan-200 hover:bg-cyan-300/10">
          Toggle Theme
        </button>
      </article>

      <form onSubmit={updateProfile} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
        <h3 className="text-lg font-semibold text-white">Update Profile</h3>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4 w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
        />
        <button className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300">Save Profile</button>
      </form>

      <form onSubmit={changePassword} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 xl:col-span-2">
        <h3 className="text-lg font-semibold text-white">Change Password</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            type="password"
            placeholder="Current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          />
          <input
            type="password"
            placeholder="New password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            className="w-full rounded-xl border border-white/15 bg-slate-950/70 px-4 py-2 text-white"
          />
        </div>
        <button className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-300">Update Password</button>
      </form>
    </section>
  );
}
