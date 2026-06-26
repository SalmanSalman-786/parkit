import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  SquareParking,
  BookOpen,
  IndianRupee,
  CarFront,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";

export default function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/bookings", icon: <BookOpen size={20} />, label: "Bookings" },
    { path: "/parkings", icon: <SquareParking size={20} />, label: "Parking Lots" },
    { path: "/users", icon: <Users size={20} />, label: "Users" },
    { path: "/guards", icon: <ShieldCheck size={20} />, label: "Guards" },
    { path: "/revenue", icon: <IndianRupee size={20} />, label: "Revenue" },
    { path: "/walkins", icon: <CarFront size={20} />, label: "Walk-ins" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sidebar Header */}
      <div className="relative flex items-center justify-between h-20 px-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 text-white font-black text-xl shadow-lg shadow-cyan-500/20 shrink-0">
            P
          </div>
          {!isCollapsed && (
            <span className="text-xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white to-slate-200">
              Park<span className="text-cyan-400">It</span>
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-7 flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-805 text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 shadow-md cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-none">
        <ul className="space-y-1.5 list-none p-0 m-0">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-250 group relative ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/90 to-indigo-650/90 text-white shadow-lg shadow-blue-505/10"
                      : "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400"
                  }`}
                >
                  <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                    {item.icon}
                  </span>
                  
                  {!isCollapsed && (
                    <span className="text-sm tracking-wide transition-opacity duration-200">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-slate-200 text-xs font-semibold rounded-lg opacity-0 invisible translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-800">
                      {item.label}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="p-4 border-t border-slate-800/80">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 cursor-pointer group relative`}
        >
          <LogOut size={20} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!isCollapsed && <span className="text-sm font-medium tracking-wide">Sign Out</span>}
          
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-950 text-red-400 text-xs font-semibold rounded-lg opacity-0 invisible translate-x-2 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-800">
              Sign Out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
