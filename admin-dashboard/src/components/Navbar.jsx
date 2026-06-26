import { useState, useEffect } from "react";
import { Search, Bell, Calendar, PlusCircle, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  const formattedDate = time.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="h-20 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-30">
      {/* Search and Date/Time */}
      <div className="flex items-center gap-6">
        {/* Date & Time display */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 text-slate-350 text-xs font-semibold">
          <Calendar size={14} className="text-cyan-400" />
          <span>{formattedDate}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200 tabular-nums">{formattedTime}</span>
        </div>
      </div>

      {/* Actions & Profiles */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/parkings/add")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <PlusCircle size={14} />
            <span>Add Parking</span>
          </button>
          <button
            onClick={() => navigate("/bookings")}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-750 hover:text-white rounded-xl border border-slate-700/60 transition-all duration-200 cursor-pointer"
          >
            <span>Bookings</span>
            <ArrowUpRight size={14} className="text-slate-500" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-400" />}
        </button>

        {/* Notifications Icon */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all duration-200 cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-slate-900" />
        </button>

        <div className="h-6 w-px bg-slate-800" />

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-500 text-white font-extrabold flex items-center justify-center shadow-md">
            A
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-100">Administrator</div>
            <div className="text-[10px] text-slate-500">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
