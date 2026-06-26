import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Car, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to get floor level deterministically from bookingId
  const getFloorLevel = (bookingId) => {
    const num = bookingId ? parseInt(bookingId.replace(/\D/g, "")) || 42 : 12;
    return (num % 3) + 1; // 1, 2, or 3
  };

  // Advanced Filtering
  const filteredBookings = bookings.filter((booking) => {
    // 1. Vehicle Search Match
    const searchMatch = (booking.vehicleNumber || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    // 2. Status Match
    const statusMatch =
      statusFilter === "ALL"
        ? true
        : statusFilter === "WALKIN"
        ? booking.type === "WALKIN"
        : statusFilter === "ONLINE"
        ? booking.type === "BOOKING"
        : booking.status === statusFilter;

    // 3. Vehicle Type Match
    const typeMatch =
      typeFilter === "ALL"
        ? true
        : booking.vehicleType === typeFilter;

    // 4. Date Match
    let dateMatch = true;
    if (dateFilter) {
      const bookingDate = booking.startTime ? booking.startTime.split("T")[0] : "";
      dateMatch = bookingDate === dateFilter;
    }

    // 5. Floor Match
    const floor = getFloorLevel(booking.bookingId);
    const floorMatch =
      floorFilter === "ALL"
        ? true
        : floor.toString() === floorFilter;

    return searchMatch && statusMatch && typeMatch && dateMatch && floorMatch;
  });

  // Pagination calculations
  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, typeFilter, dateFilter, floorFilter]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Overall counts for statistics
  const totalCount = bookings.length;
  const activeCount = bookings.filter((b) => b.status === "ACTIVE").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const walkinCount = bookings.filter((b) => b.type === "WALKIN").length;

  return (
    <AdminLayout>
      {/* Header and Stats */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">Manage and filter parking bookings</p>
        </div>
      </div>

      {/* Booking KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</span>
          <h3 className="text-3xl font-extrabold text-slate-100 mt-2">{totalCount}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active</span>
          <h3 className="text-3xl font-extrabold text-green-400 mt-2">{activeCount}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
          <h3 className="text-3xl font-extrabold text-blue-400 mt-2">{completedCount}</h3>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Walk-in</span>
          <h3 className="text-3xl font-extrabold text-purple-400 mt-2">{walkinCount}</h3>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 mb-6 space-y-4">
        <div className="flex items-center gap-2 text-slate-350 text-sm font-bold border-b border-slate-850 pb-3">
          <SlidersHorizontal size={16} className="text-blue-400" />
          <span>Advanced Search Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search by Vehicle */}
          <div className="relative">
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Vehicle Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search plate..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-205 text-xs"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="BOOKED">Booked</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="WALKIN">Walk-In Only</option>
              <option value="ONLINE">Online Only</option>
            </select>
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Vehicle Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
            >
              <option value="ALL">All Types</option>
              <option value="CAR">Car / Four Wheeler</option>
              <option value="BIKE">Bike / Two Wheeler</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
              />
            </div>
          </div>

          {/* Floor Level Filter */}
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1.5">
              Floor Level
            </label>
            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
            >
              <option value="ALL">All Floors</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* modern table with sticky headers */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg mb-6">
        <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="sticky top-0 bg-slate-900 z-10 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Floor / Slot</th>
                <th className="p-4">Parking Lot</th>
                <th className="p-4">Status</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/80 text-slate-300">
              {currentItems.length > 0 ? (
                currentItems.map((booking) => {
                  const floorNum = getFloorLevel(booking.bookingId);
                  const virtualSlot = `S-${booking.bookingId ? (parseInt(booking.bookingId.replace(/\D/g, "")) || 42) % 15 + 1 : 12}`;

                  return (
                    <tr
                      key={booking.id}
                      onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                      className="hover:bg-slate-850/30 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-mono font-bold text-slate-100">{booking.bookingId}</td>
                      <td className="p-4 font-mono">{booking.vehicleNumber}</td>
                      <td className="p-4">
                        <span className="text-xs bg-slate-950 px-2.5 py-1 rounded-md text-slate-300 font-medium border border-slate-800">
                          L{floorNum} / {virtualSlot}
                        </span>
                      </td>
                      <td className="p-4 max-w-[150px] truncate">{booking.parkingName}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            booking.status === "ACTIVE"
                              ? "bg-green-500/10 text-green-400"
                              : booking.status === "COMPLETED"
                              ? "bg-blue-500/10 text-blue-400"
                              : booking.status === "CANCELLED"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                            booking.type === "WALKIN"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-cyan-500/10 text-cyan-400"
                          }`}
                        >
                          {booking.type}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-205">₹{booking.amount}</td>
                      <td className="p-4 uppercase text-slate-400 text-xs">{booking.paymentMode || "N/A"}</td>
                      <td className="p-4 font-semibold text-red-400">₹{booking.fineAmount || 0}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="p-12 text-center text-slate-500 font-medium">
                    No bookings found matching selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border border-slate-800/80 rounded-2xl">
          <span className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-250">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-bold text-slate-250">{Math.min(indexOfLastItem, totalItems)}</span> of{" "}
            <span className="font-bold text-slate-250">{totalItems}</span> bookings
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-slate-800 transition-colors cursor-pointer ${
                currentPage === 1
                  ? "bg-slate-900/50 text-slate-600 border-slate-900/30 cursor-not-allowed"
                  : "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="text-xs text-slate-400 px-3">
              Page <span className="font-bold text-slate-200">{currentPage}</span> of{" "}
              <span className="font-bold text-slate-200">{totalPages}</span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-slate-800 transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? "bg-slate-900/50 text-slate-600 border-slate-900/30 cursor-not-allowed"
                  : "bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
