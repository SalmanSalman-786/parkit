import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Calendar, TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt, Milestone, ArrowRight } from "lucide-react";

function RevenueCard({ title, value, trend, trendType, clickable, onClick }) {
  const isUp = trendType === "up";
  
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md flex flex-col justify-between transition-all duration-200 ${
        clickable ? "hover:border-slate-700/80 cursor-pointer hover:shadow-lg" : "cursor-default"
      }`}
    >
      <div>
        <div className="flex justify-between items-center text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span>{title}</span>
          {trend && (
            <span
              className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded ${
                isUp ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              }`}
            >
              {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {trend}
            </span>
          )}
        </div>

        <div className="text-3xl font-extrabold text-slate-100 mt-3 tabular-nums">
          {value}
        </div>
      </div>
      
      {clickable && (
        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider">
          <span>Inspect Transactions</span>
          <ArrowRight size={10} />
        </div>
      )}
    </div>
  );
}

export default function Revenue() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [parkingRevenue, setParkingRevenue] = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadRevenue(selectedDate);
    loadParkingRevenue(selectedDate);
    loadRevenueTrend();
  }, []);

  const loadRevenue = async (date) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/revenue?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadParkingRevenue = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/admin/revenue/parking?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParkingRevenue(res.data);
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

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    loadRevenue(date);
    loadParkingRevenue(date);
  };

  // Compute stats or splits for graphic representation
  const paymentSplitData = [
    { name: "Online", value: data?.onlineRevenue || 0, fill: "#3b82f6" },
    { name: "Cash", value: data?.cashRevenue || 0, fill: "#10b981" },
  ];

  return (
    <AdminLayout>
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Revenue Analytics</h1>
          <p className="text-slate-400 text-sm mt-1">Track system earnings, refunds, and parking-wise yields</p>
        </div>
      </div>

      {/* Date Selector bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-330 text-sm font-bold">
          <Calendar size={18} className="text-blue-400" />
          <span>Audit Earnings Statement</span>
        </div>
        
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-4 py-2 bg-slate-955 border border-slate-800 focus:border-slate-700 focus:outline-none rounded-xl text-slate-300 text-xs cursor-pointer"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {/* Revenue metrics cards with trends */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            <RevenueCard
              title="Net Revenue"
              value={`₹${data?.netRevenue || 0}`}
              trend="+8.4%"
              trendType="up"
            />
            <RevenueCard
              title="Online Payments"
              value={`₹${data?.onlineRevenue || 0}`}
              trend="+12.1%"
              trendType="up"
            />
            <RevenueCard
              title="Cash Collection"
              value={`₹${data?.cashRevenue || 0}`}
              trend="-2.4%"
              trendType="down"
            />
            <RevenueCard
              title="Fine Earnings"
              value={`₹${data?.fineRevenue || 0}`}
              trend="+4.8%"
              trendType="up"
            />
            <RevenueCard
              title="Refunds Paid"
              value={`₹${data?.refundAmount || 0}`}
              trend="+1.2%"
              trendType="down" // positive increase in refund count is technically a downward metric
            />
            <RevenueCard
              title="Transactions"
              value={data?.transactionCount || 0}
              trend="+5.6%"
              trendType="up"
              clickable
              onClick={() => navigate("/revenue/transactions")}
            />
          </div>

          {/* Core Analytics Middle Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* 7 Days Revenue Trend line graph */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md lg:col-span-2 flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-100 mb-6">Historical Trend (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Method Split Bar Chart */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md flex flex-col justify-between">
              <h3 className="text-base font-bold text-slate-150 mb-6">Payment Mode Split</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={paymentSplitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#0f172a", borderColor: "#334155", borderRadius: "12px" }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 flex justify-around text-xs text-slate-400 font-semibold border-t border-slate-850 pt-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  <span>Online: ₹{data?.onlineRevenue || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span>Cash: ₹{data?.cashRevenue || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parking-wise revenue leaderboard */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-5 border-b border-slate-850">
              <h2 className="text-base font-bold text-slate-105">Parking-wise Contribution</h2>
            </div>

            {parkingRevenue.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-semibold text-sm">
                No revenue reports logged for the selected date range.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-505 font-bold uppercase tracking-wider">
                      <th className="p-4">Rank ID</th>
                      <th className="p-4">Facility Name</th>
                      <th className="p-4">Billing Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {parkingRevenue.map((parking, index) => (
                      <tr key={parking.parkingId} className="hover:bg-slate-850/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-400">#{index + 1}</td>
                        <td className="p-4 font-bold text-slate-100">{parking.parkingName}</td>
                        <td className="p-4 text-emerald-400 font-extrabold font-mono text-sm">₹{parking.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
