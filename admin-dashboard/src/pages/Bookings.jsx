import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

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

  const filteredBookings = bookings.filter((booking) => {
    const searchMatch = (booking.vehicleNumber || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const filterMatch =
      filter === "ALL"
        ? true
        : filter === "WALKIN"
          ? booking.type === "WALKIN"
          : filter === "ONLINE"
            ? booking.type === "BOOKING"
            : booking.status === filter;

    return searchMatch && filterMatch;
  });

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    color: "#334155",
    fontWeight: "600",
    background: "#f8fafc",
  };

  const tdStyle = {
    padding: "14px",
    color: "#0f172a",
    borderTop: "1px solid #e5e7eb",
  };

  const totalBookings = bookings.length;

  const activeBookings = bookings.filter((b) => b.status === "ACTIVE").length;

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED",
  ).length;

  const walkInBookings = bookings.filter((b) => b.type === "WALKIN").length;

  const filterBtn = (value, label) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        background: filter === value ? "#15803d" : "#ffffff",
        color: filter === value ? "#ffffff" : "#374151",
        border: "1px solid #e5e7eb",
        borderRadius: "999px",
        padding: "10px 16px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {label}
    </button>
  );

  function StatCard({ title, value }) {
    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <div
          style={{
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
            marginTop: "8px",
          }}
        >
          {value}
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          marginBottom: "25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          Bookings
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <StatCard title="Total Bookings" value={totalBookings} />

          <StatCard title="Active" value={activeBookings} />

          <StatCard title="Completed" value={completedBookings} />

          <StatCard title="Walk-In" value={walkInBookings} />
        </div>

        <p
          style={{
            color: "#6b7280",
            marginTop: "5px",
          }}
        >
          Monitor all parking bookings
        </p>
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "12px 18px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Search vehicle number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "15px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        {filterBtn("ALL", "All")}
        {filterBtn("BOOKED", "Booked")}
        {filterBtn("ACTIVE", "Active")}
        {filterBtn("COMPLETED", "Completed")}
        {filterBtn("CANCELLED", "Cancelled")}
        {filterBtn("WALKIN", "Walk-In")}
        {filterBtn("ONLINE", "Online")}
      </div>
      <div
        style={{
          background: "#ffffff",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Booking ID</th>

              <th style={thStyle}>Vehicle</th>

              <th style={thStyle}>Parking</th>

              <th style={thStyle}>Status</th>

              <th style={thStyle}>Type</th>

              <th style={thStyle}>Amount</th>

              <th style={thStyle}>Payment</th>

              <th style={thStyle}>Fine</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr
                key={booking.id}
                onClick={() => navigate(`/bookings/${booking.bookingId}`)}
                style={{
                  cursor: "pointer",
                }}
              >
                <td style={tdStyle}>{booking.bookingId}</td>

                <td style={tdStyle}>{booking.vehicleNumber}</td>

                <td style={tdStyle}>{booking.parkingName}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        booking.status === "ACTIVE"
                          ? "#dcfce7"
                          : booking.status === "COMPLETED"
                            ? "#dbeafe"
                            : booking.status === "CANCELLED"
                              ? "#fee2e2"
                              : "#f3f4f6",

                      color:
                        booking.status === "ACTIVE"
                          ? "#166534"
                          : booking.status === "COMPLETED"
                            ? "#1d4ed8"
                            : booking.status === "CANCELLED"
                              ? "#991b1b"
                              : "#374151",

                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {booking.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        booking.type === "WALKIN" ? "#fef3c7" : "#dbeafe",

                      color: booking.type === "WALKIN" ? "#92400e" : "#1d4ed8",

                      padding: "6px 12px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "600",
                    }}
                  >
                    {booking.type}
                  </span>
                </td>

                <td style={tdStyle}>₹{booking.amount}</td>

                <td style={tdStyle}>{booking.paymentMode || "N/A"}</td>

                <td style={tdStyle}>₹{booking.fineAmount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
