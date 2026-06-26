import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Search, Phone, Car, BookOpen, Wallet, ArrowUpRight } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.phoneNumber || "").includes(search)
  );

  return (
    <AdminLayout>
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Registered Users</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and audit registered system customers</p>
      </div>

      {/* Search Bar Widget */}
      <div className="relative max-w-lg mb-8">
        <input
          type="text"
          placeholder="Search by name or contact phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-905 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-sm placeholder-slate-505 transition-all"
        />
        <Search className="absolute left-4 top-3.5 text-slate-555" size={16} />
      </div>

      {/* Grid of Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-755/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Profile header initials */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white font-extrabold text-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-105 group-hover:text-white transition-colors">
                      {user.name || "System User"}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Phone size={12} />
                      <span className="font-mono">{user.phoneNumber || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-850/60 my-4" />

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col items-center">
                    <Car size={14} className="text-blue-455 mb-1" />
                    <span className="text-[10px] text-slate-500 font-bold block">Vehicles</span>
                    <span className="text-sm font-extrabold text-slate-200 mt-1">{user.vehicleCount || 0}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col items-center">
                    <BookOpen size={14} className="text-purple-455 mb-1" />
                    <span className="text-[10px] text-slate-500 font-bold block">Bookings</span>
                    <span className="text-sm font-extrabold text-slate-200 mt-1">{user.bookingCount || 0}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex flex-col items-center">
                    <Wallet size={14} className="text-emerald-455 mb-1" />
                    <span className="text-[10px] text-slate-505 font-bold block">Spent</span>
                    <span className="text-sm font-extrabold text-emerald-400 mt-1">₹{user.totalSpent || 0}</span>
                  </div>
                </div>
              </div>

              {/* View Action Link */}
              <button
                onClick={() => navigate(`/users/${user.id}`)}
                className="w-full mt-6 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md"
              >
                <span>Inspect Profile</span>
                <ArrowUpRight size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">
            No registered users found matching query
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
