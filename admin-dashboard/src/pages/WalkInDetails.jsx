import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { ArrowLeft, Phone, Calendar, ShieldCheck, Wallet, Car } from "lucide-react";

export default function WalkInDetails() {
  const { vehicleNumber } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/walkins/${vehicleNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

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

  if (!data) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Back navigation and header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/walkins")}
          className="p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Walk-In Profile</span>
          <h1 className="text-xl font-bold text-white tracking-tight">{data.vehicleNumber}</h1>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-xl mb-8 flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg">
          <Car size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white font-mono tracking-wider">{data.vehicleNumber}</h2>
          <p className="text-slate-400 text-xs mt-1.5 flex items-center gap-1.5">
            <Phone size={14} className="text-slate-500" />
            <span className="font-mono text-slate-300">{data.phoneNumber || "No contact info saved"}</span>
          </p>
        </div>
      </div>

      {/* Statistics breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-purple-400" />
            <span>Usage Frequency</span>
          </div>
          <h3 className="text-3xl font-extrabold text-white mt-2">{data.walkinCount} check-ins</h3>
          <p className="text-xs text-slate-405 mt-2">Visits recorded on walk-in tickets</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Wallet size={12} className="text-emerald-400" />
            <span>Total Expenditure</span>
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-400 mt-2">₹{data.totalAmount}</h3>
          <p className="text-xs text-slate-405 mt-2">Includes hourly fares and late penalty fees</p>
        </div>
      </div>

      {/* History log lists */}
      <h3 className="text-base font-bold text-slate-105 mb-4 flex items-center gap-2">
        <Calendar size={16} className="text-blue-400" />
        <span>Check-In History logs</span>
      </h3>

      <div className="space-y-4">
        {data.history.map((booking) => (
          <div
            key={booking.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-750 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Facility Destination
              </span>
              <span className="text-sm font-bold text-slate-100 block">{booking.parkingName}</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
                <span>Entry: {formatDate(booking.entryTime)}</span>
                <span>Exit: {formatDate(booking.exitTime)}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block text-right">
                  Status
                </span>
                <span
                  className={`mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                    booking.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-400"
                      : booking.status === "ACTIVE"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-505 font-bold uppercase tracking-wider block">
                  Amount
                </span>
                <span className="text-sm font-extrabold text-slate-200 mt-1 block">₹{booking.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}