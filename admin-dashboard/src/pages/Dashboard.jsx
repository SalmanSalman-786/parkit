import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import StatCard from "../components/StatCard";
import api from "../services/api";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [topParkings, setTopParkings] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadRevenueTrend();
    loadTopParkings();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRevenueTrend = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/revenue/last7days", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRevenueTrend(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTopParkings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/admin/revenue/parking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTopParkings(res.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "20px",
        }}
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          subtitle="Registered users"
        />

        <StatCard
          title="Total Guards"
          value={stats.totalGuards || 0}
          subtitle="Active guards"
        />

        <StatCard
          title="Parking Lots"
          value={stats.totalParkings || 0}
          subtitle="Available locations"
        />

        <StatCard
          title="Today's Revenue"
          value={`₹${stats.todayRevenue || 0}`}
          subtitle="Today's earnings"
        />
      </div>

      {/* ANALYTICS SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "25px",
        }}
      >
        {/* Revenue Overview */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            minHeight: "320px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            Last 7 Days Revenue
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                fill="#d1fae5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        

        {/* Operations Summary */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "24px",
            border: "1px solid #e5e7eb",
            minHeight: "320px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Operations Summary
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Active Bookings
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {stats.activeBookings || 0}
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "14px",
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                Active Walk-ins
              </div>

              <div
                style={{
                  marginTop: "5px",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#111827",
                }}
              >
                {stats.activeWalkins || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
