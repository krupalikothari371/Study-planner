import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-app text-slate-100">
      <Sidebar />
      <main className="px-4 py-4 lg:ml-64 lg:px-7">
        <TopNavbar />
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
