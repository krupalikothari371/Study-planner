import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Welcome back!");
  };

  const signup = async (payload) => {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    toast.success("Account created successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out");
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (localStorage.getItem("token")) {
          await refreshProfile();
        }
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsAuthLoading(false);
      }
    };

    init();
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isAuthLoading, login, signup, logout, refreshProfile, setUser }),
    [user, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
