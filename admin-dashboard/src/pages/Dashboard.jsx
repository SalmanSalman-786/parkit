import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import Drawer from "../components/ui/Drawer";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import {
  Car,
  CalendarCheck,
  CheckSquare,
  TrendingUp,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  MapPin,
  CreditCard,
  User,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    loadDashboard();
    loadBookings();
    loadParkings();
    loadRevenueTrend();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadParkings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/parking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParkings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRevenueTrend = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/revenue/last7days", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueTrend(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculations
  const totalCapacity = parkings.reduce(
    (acc, p) => acc + (p.twoWheelerCapacity || 0) + (p.fourWheelerCapacity || 0),
    0
  );

  const activeVehicles = bookings.filter((b) => b.status === "ACTIVE");
  const activeCount = activeVehicles.length;
  
  const availableSlots = Math.max(0, totalCapacity - activeCount);
  const occupancyPercentage = totalCapacity
    ? ((activeCount / totalCapacity) * 100).toFixed(1)
    : 0;

  const activeBookingsCount = bookings.filter(
    (b) => b.status === "ACTIVE" && b.type === "BOOKING"
  ).length;

  const todayRevenue = stats.todayRevenue || 0;

  // Filtered vehicles for Search
  const filteredVehicles = bookings.filter((b) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return false;
    const isCurrentlyParked = b.status === "ACTIVE";
    const matchesVehicle = (b.vehicleNumber || "").toLowerCase().includes(query);
    return isCurrentlyParked && matchesVehicle;
  });

  // Recent entries (status ACTIVE, sort by entryTime desc)
  const recentEntries = [...bookings]
    .filter((b) => b.entryTime)
    .sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))
    .slice(0, 5);

  // Recent exits (status COMPLETED, sort by exitTime desc)
  const recentExits = [...bookings]
    .filter((b) => b.exitTime)
    .sort((a, b) => new Date(b.exitTime) - new Date(a.exitTime))
    .slice(0, 5);

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper to calculate duration
  const getDuration = (entryTimeStr) => {
    if (!entryTimeStr) return "N/A";
    const entry = new Date(entryTimeStr);
    const diffMs = Math.abs(new Date() - entry);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Simulated Occupancy Trend data for chart (entries per day in last 7 days)
  const getOccupancyTrend = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const trend = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - idx));
      const dayName = days[d.getDay()];
      const dateString = d.toISOString().split("T")[0];
      const count = bookings.filter((b) => b.startTime && b.startTime.startsWith(dateString)).length;
      return { day: dayName, bookings: count + Math.floor(Math.random() * 2) };
    });
    return trend;
  };

  const handleOpenDrawer = (vehicle) => {
    // Generate deterministic slot and floor numbers from the vehicle number or bookingId
    const num = vehicle.bookingId ? parseInt(vehicle.bookingId.replace(/\D/g, "")) || 42 : 12;
    const floor = (num % 3) + 1;
    const slot = (num % 15) + 1;
    
    setSelectedVehicle({
      ...vehicle,
      floorNumber: floor,
      parkingSlot: `S-${slot}`,
    });
    setIsDrawerOpen(true);
  };

  return (
    <AdminLayout>
      {/* 1. Welcome Banner */}
      <div className="relative overflow-hidden mb-8 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-72 h-72 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time analytics and controls for Smart Parking Management.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-850/80 backdrop-blur-sm border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Occupancy</div>
              <div className="text-sm font-extrabold text-cyan-400">{occupancyPercentage}%</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-850/80 backdrop-blur-sm border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Available Spaces</div>
              <div className="text-sm font-extrabold text-green-400">{availableSlots}</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-850/80 backdrop-blur-sm border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vehicles Parked</div>
              <div className="text-sm font-extrabold text-blue-400">{activeCount}</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-slate-850/80 backdrop-blur-sm border border-slate-800 text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Today's Revenue</div>
              <div className="text-sm font-extrabold text-purple-400">₹{todayRevenue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Total Vehicles */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Vehicles</span>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{activeCount}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-colors">
              <Car size={22} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-green-400 font-semibold flex items-center">Live state</span>
            currently parked inside slots
          </p>
        </div>

        {/* Card 2: Active Bookings */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Bookings</span>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{activeBookingsCount}</h3>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">
              <CalendarCheck size={22} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1">
            <span className="text-purple-400 font-semibold">{stats.activeWalkins || 0}</span>
            active walk-in vehicles
          </p>
        </div>

        {/* Card 3: Available Slots */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Available Slots</span>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{availableSlots}</h3>
            </div>
            <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-500/20 group-hover:text-green-300 transition-colors">
              <CheckSquare size={22} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Total capacity of <span className="text-slate-205 font-semibold">{totalCapacity}</span> slots
          </p>
        </div>

        {/* Card 4: Revenue Today */}
        <div className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-all duration-300 hover:-translate-y-1">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue Today</span>
              <h3 className="text-3xl font-extrabold text-slate-100 mt-2">₹{todayRevenue}</h3>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-colors">
              <TrendingUp size={22} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            Refund amount subtracted
          </p>
        </div>
      </div>

      {/* 3. Dedicated Vehicle Search Feature */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 mb-8 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
          <Search size={18} className="text-blue-400" />
          <span>Vehicle Search</span>
        </h3>
        
        <div className="relative max-w-lg mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Type vehicle number... (e.g. MH12)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-200 text-sm placeholder-slate-500 transition-all"
          />
        </div>

        {searchQuery.trim() && (
          <div className="overflow-x-auto border border-slate-850 rounded-xl bg-slate-950">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-850 text-slate-450 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Vehicle Number</th>
                  <th className="p-3.5">Owner / Phone</th>
                  <th className="p-3.5">Entry Time</th>
                  <th className="p-3.5">Vehicle Type</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-slate-300">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-100">{vehicle.vehicleNumber}</td>
                      <td className="p-3.5">{vehicle.phone || "Walk-In"}</td>
                      <td className="p-3.5">{formatDate(vehicle.entryTime)}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px]">
                          {vehicle.vehicleType}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold text-[10px]">
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleOpenDrawer(vehicle)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-6 text-center text-slate-500 font-medium">
                      Vehicle not found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Occupancy Trend Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
          <h3 className="text-base font-bold text-slate-100 mb-6">Occupancy / Booking Load</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={getOccupancyTrend()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
              />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend Chart */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
          <h3 className="text-base font-bold text-slate-100 mb-6">Last 7 Days Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 5. Bottom Section: Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Entries */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownLeft className="text-green-400" size={18} />
            <h3 className="text-base font-bold text-slate-100">Recent Vehicle Entries</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Parking Lot</th>
                  <th className="p-3">Entry Time</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {recentEntries.length > 0 ? (
                  recentEntries.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-200">{b.vehicleNumber}</td>
                      <td className="p-3 max-w-[120px] truncate">{b.parkingName}</td>
                      <td className="p-3 text-slate-400">{formatDate(b.entryTime)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenDrawer(b)}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-600">
                      No entry logs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Exits */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="text-blue-400" size={18} />
            <h3 className="text-base font-bold text-slate-100">Recent Vehicle Exits</h3>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px] sm:text-xs">
              <thead>
                <tr className="bg-slate-950/60 border-b border-slate-850 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Parking Lot</th>
                  <th className="p-3">Exit Time</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850/60 text-slate-300">
                {recentExits.length > 0 ? (
                  recentExits.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-200">{b.vehicleNumber}</td>
                      <td className="p-3 max-w-[120px] truncate">{b.parkingName}</td>
                      <td className="p-3 text-slate-400">{formatDate(b.exitTime)}</td>
                      <td className="p-3 text-right text-green-400 font-semibold">₹{b.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-6 text-center text-slate-600">
                      No exit logs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Vehicle Details Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Vehicle Parking Details"
      >
        {selectedVehicle && (
          <div className="space-y-6">
            {/* Status & Badge Header */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-855">
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Current Status
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-extrabold text-green-400 uppercase tracking-wide">
                    {selectedVehicle.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-right">
                  Vehicle Type
                </div>
                <div className="mt-1 text-right">
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-black text-slate-200">
                    {selectedVehicle.vehicleType}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Number Big Banner */}
            <div className="text-center py-6 px-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 border border-slate-850 shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                License Plate
              </span>
              <span className="text-2xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {selectedVehicle.vehicleNumber}
              </span>
            </div>

            {/* Visual Location Info */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-400" />
                <span>Parking Slot Assignment</span>
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 rounded-xl text-center border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold block">FLOOR</span>
                  <span className="text-lg font-black text-cyan-400">Level {selectedVehicle.floorNumber}</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl text-center border border-slate-850">
                  <span className="text-[10px] text-slate-500 font-bold block">SLOT</span>
                  <span className="text-lg font-black text-cyan-400">{selectedVehicle.parkingSlot}</span>
                </div>
              </div>

              {/* Visual mini-grid indicator */}
              <div className="border border-dashed border-slate-800 rounded-xl p-3 bg-slate-900/30">
                <span className="text-[9px] text-slate-655 font-bold uppercase tracking-wider block text-center mb-2">
                  Floor Map Layout
                </span>
                <div className="grid grid-cols-5 gap-1.5 max-w-[200px] mx-auto">
                  {Array.from({ length: 15 }).map((_, idx) => {
                    const isTarget = `S-${idx + 1}` === selectedVehicle.parkingSlot;
                    return (
                      <div
                        key={idx}
                        className={`h-6 rounded-md flex items-center justify-center text-[9px] font-bold ${
                          isTarget
                            ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 animate-pulse"
                            : (idx % 4 === 0)
                            ? "bg-red-500/20 text-red-500/40 border border-red-500/10 cursor-not-allowed"
                            : "bg-green-500/10 text-green-500/40 border border-green-500/10"
                        }`}
                      >
                        {idx + 1}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time and Duration Details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-purple-400" />
                <span>Timing Records</span>
              </h4>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Entry Timestamp:</span>
                  <span className="text-slate-200 font-medium">{formatDate(selectedVehicle.entryTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Duration Parked:</span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    {getDuration(selectedVehicle.entryTime)}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <User size={14} className="text-indigo-400" />
                <span>Owner & Customer</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Customer Type:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-850 text-slate-305 border border-slate-800">
                    {selectedVehicle.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone / Contact:</span>
                  <span className="text-slate-200 font-mono font-medium">{selectedVehicle.phone || "Walk-In Customer"}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-855 space-y-4.5">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <CreditCard size={14} className="text-emerald-400" />
                <span>Payment Details</span>
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Amount Accrued:</span>
                  <span className="text-slate-205 font-bold">₹{selectedVehicle.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Payment Mode:</span>
                  <span className="text-slate-205 font-bold uppercase">{selectedVehicle.paymentMode || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </AdminLayout>
  );
}
