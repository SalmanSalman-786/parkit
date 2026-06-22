import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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
      (user.phoneNumber || "").includes(search),
  );

  const thStyle = {
    padding: "16px",
    textAlign: "left",
    color: "#64748b",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "16px",
    color: "#111827",
  };

  return (
    <AdminLayout>
      <h2
        style={{
          marginBottom: "20px",
          color: "#0f172a",
        }}
      >
        Users
      </h2>

      <input
        type="text"
        placeholder="Search by name or phone number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "25px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
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
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th style={thStyle}>User</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Vehicles</th>
              <th style={thStyle}>Bookings</th>
              <th style={thStyle}>Total Spent</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                style={{
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <td style={tdStyle}>{user.name}</td>

                <td style={tdStyle}>{user.phoneNumber}</td>

                <td style={tdStyle}>{user.vehicleCount}</td>

                <td style={tdStyle}>{user.bookingCount}</td>

                <td style={tdStyle}>₹{user.totalSpent}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/users/${user.id}`)}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
