import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function UserDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );
  }

  const user = data.user;

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    color: "#64748b",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "14px",
    color: "#111827",
  };

  return (
    <AdminLayout>
      {/* Profile Header */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          padding: "25px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: "25px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            background: "#10b981",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            fontWeight: "700",
          }}
        >
          {user.name?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: "700",
            }}
          >
            {user.name}
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#475569",
              fontSize: "18px",
            }}
          >
            {user.phoneNumber}
          </p>
        </div>
      </div>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            Total Vehicles
          </h4>

          <h1
            style={{
              marginTop: "20px",
              marginBottom: 0,
              color: "#0f172a",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            {user.vehicles?.length || 0}
          </h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            Total Bookings
          </h4>

          <h1
            style={{
              marginTop: "20px",
              marginBottom: 0,
              color: "#0f172a",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            {data.bookings.length}
          </h1>
        </div>

        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <h4
            style={{
              margin: 0,
              color: "#64748b",
              fontWeight: "600",
            }}
          >
            Total Spent
          </h4>

          <h1
            style={{
              marginTop: "20px",
              marginBottom: 0,
              color: "#0f172a",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            ₹{data.totalSpent}
          </h1>
        </div>
      </div>

      {/* Vehicles */}

      <h3
        style={{
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Registered Vehicles
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "15px",
          marginBottom: "35px",
        }}
      >
        {user.vehicles?.map((vehicle, index) => (
          <div
            key={index}
            style={{
              background: "#ffffff",
              padding: "20px",
              borderRadius: "14px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              {vehicle.vehicleNumber}
            </div>

            <div
              style={{
                marginTop: "8px",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Registered Vehicle
            </div>
          </div>
        ))}
      </div>

      {/* Booking History */}

      <h3
        style={{
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Booking History
      </h3>

      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
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
              <th style={thStyle}>Booking ID</th>
              <th style={thStyle}>Vehicle</th>
              <th style={thStyle}>Parking</th>
              <th style={thStyle}>Amount</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Start Time</th>
            </tr>
          </thead>

          <tbody>
            {data.bookings.map((booking) => (
              <tr
                key={booking.id}
                style={{
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <td style={tdStyle}>{booking.bookingId}</td>

                <td style={tdStyle}>{booking.vehicleNumber}</td>

                <td style={tdStyle}>{booking.parkingName}</td>

                <td style={tdStyle}>₹{booking.amount}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background:
                        booking.status === "COMPLETED"
                          ? "#dcfce7"
                          : booking.status === "ACTIVE"
                            ? "#dbeafe"
                            : "#fee2e2",
                      color:
                        booking.status === "COMPLETED"
                          ? "#166534"
                          : booking.status === "ACTIVE"
                            ? "#1d4ed8"
                            : "#991b1b",
                    }}
                  >
                    {booking.status}
                  </span>
                </td>

                <td style={tdStyle}>{booking.startTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
