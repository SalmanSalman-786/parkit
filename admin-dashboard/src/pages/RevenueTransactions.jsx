import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function RevenueTransactions() {
  const [transactions, setTransactions] = useState([]);

  const [filter, setFilter] = useState("ALL");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [parkings, setParkings] = useState([]);

  const [selectedParking, setSelectedParking] = useState("");

  useEffect(() => {
    loadTransactions(selectedDate, filter, selectedParking);

    loadParkings();
  }, []);

  const loadTransactions = async (date, selectedFilter, parkingId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `/admin/revenue/transactions?date=${date}&filter=${selectedFilter}&parkingId=${parkingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadParkings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/parking", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setParkings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;

    setSelectedDate(date);

    loadTransactions(date, filter, selectedParking);
  };

  const handleFilter = (value) => {
    setFilter(value);

    loadTransactions(selectedDate, value, selectedParking);
  };

  const handleParkingChange = (e) => {
    const value = e.target.value;

    setSelectedParking(value);

    loadTransactions(selectedDate, filter, value);
  };

  const thStyle = {
    padding: "14px",
    textAlign: "left",
    color: "#334155",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "14px",
    color: "#0f172a",
  };

  const totalTransactions = transactions.length;

  const onlineCount = transactions.filter(
    (t) => t.transactionType === "ONLINE",
  ).length;

  const cashCount = transactions.filter(
    (t) => t.transactionType === "CASH",
  ).length;

  const refundCount = transactions.filter(
    (t) => t.transactionType === "REFUND",
  ).length;

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

  const filterBtn = (value, label) => (
    <button
      onClick={() => handleFilter(value)}
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
          Revenue Transactions
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "5px",
          }}
        >
          View all revenue related transactions
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <StatCard title="Total Transactions" value={totalTransactions} />

        <StatCard title="Online" value={onlineCount} />

        <StatCard title="Cash" value={cashCount} />

        <StatCard title="Refunds" value={refundCount} />
      </div>

      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
              }}
            >
              Parking
            </label>

            <select
              value={selectedParking}
              onChange={handleParkingChange}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
              }}
            >
              <option value="">All Parkings</option>

              {parkings.map((parking) => (
                <option key={parking.id} value={parking.id}>
                  {parking.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {filterBtn("ALL", "All")}
          {filterBtn("ONLINE", "Online")}
          {filterBtn("CASH", "Cash")}
          {filterBtn("FINE", "Fine")}
          {filterBtn("REFUND", "Refund")}
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #e5e7eb",
          marginBottom: "25px",
        }}
      />

      {transactions.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "24px",
            color: "#6b7280",
          }}
        >
          No transactions found.
        </div>
      ) : (
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
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Parking</th>
                <th style={thStyle}>Booking</th>
                <th style={thStyle}>Vehicle</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  style={{
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        background:
                          tx.transactionType === "REFUND"
                            ? "#fee2e2"
                            : tx.transactionType === "FINE"
                              ? "#fef3c7"
                              : "#dcfce7",
                        color:
                          tx.transactionType === "REFUND"
                            ? "#991b1b"
                            : tx.transactionType === "FINE"
                              ? "#92400e"
                              : "#166534",
                      }}
                    >
                      {tx.transactionType}
                    </span>
                  </td>

                  <td style={tdStyle}>{tx.parkingName}</td>

                  <td style={tdStyle}>{tx.bookingId}</td>

                  <td style={tdStyle}>{tx.vehicleNumber}</td>

                  <td style={tdStyle}>{tx.paymentMode}</td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "700",
                      color: "#15803d",
                    }}
                  >
                    ₹{tx.amount}
                  </td>

                  <td style={tdStyle}>{tx.dateTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
