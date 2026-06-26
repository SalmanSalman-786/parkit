import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Phone, Footprints, ArrowUpRight, ShieldAlert, CircleDollarSign } from "lucide-react";

export default function WalkIns() {
  const [walkins, setWalkins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWalkins();
  }, []);

  const loadWalkins = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/admin/walkins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWalkins(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Walk-In Records</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and audit unregistered walk-in vehicle check-ins</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {walkins.length > 0 ? (
          walkins.map((walkin) => (
            <div
              key={walkin.vehicleNumber}
              onClick={() => navigate(`/walkins/${walkin.vehicleNumber}`)}
              className="group p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Header info */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase tracking-wider">
                    <Footprints size={14} className="text-purple-400" />
                    <span>Walk-In Customer</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase">
                    Unregistered
                  </span>
                </div>

                {/* Licence Plate */}
                <h3 className="text-xl font-black font-mono tracking-widest text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {walkin.vehicleNumber}
                </h3>

                <div className="h-px bg-slate-850/60 my-4" />

                {/* Details list */}
                <div className="space-y-2.5 text-xs text-slate-350">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-505 font-bold flex items-center gap-1.5">
                      <Phone size={12} />
                      Contact
                    </span>
                    <span className="font-mono text-slate-202">{walkin.phoneNumber || "No Phone Contact"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-505 font-bold flex items-center gap-1.5">
                      <ShieldAlert size={12} />
                      Usage Frequency
                    </span>
                    <span className="text-slate-202">{walkin.walkinCount} visits</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-505 font-bold flex items-center gap-1.5">
                      <CircleDollarSign size={12} />
                      Paid Yield
                    </span>
                    <span className="text-emerald-400 font-extrabold font-mono">₹{walkin.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Action trigger */}
              <div className="mt-6 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-400 transition-colors font-bold uppercase tracking-wider">
                <span>View check-in logs</span>
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 font-medium">
            No walk-in checkout logs found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
