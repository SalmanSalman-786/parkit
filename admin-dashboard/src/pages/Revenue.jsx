import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function RevenueCard({ title, value, clickable, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        padding: "24px",
        cursor: clickable ? "pointer" : "default",
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
          marginTop: "10px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function Revenue() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [parkingRevenue, setParkingRevenue] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadRevenue(selectedDate);

    loadParkingRevenue(selectedDate);
  }, []);

  const loadRevenue = async (date) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await api.get(`/admin/revenue?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setParkingRevenue(res.data);
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

  return (
    <AdminLayout>
      {/* Header */}
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
          Revenue Dashboard
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "5px",
          }}
        >
          Track revenue, refunds and transactions
        </p>
      </div>

      {/* Date Selector */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "20px",
          padding: "20px",
          marginBottom: "25px",
        }}
      >
        <label
          style={{
            display: "block",
            marginBottom: "10px",
            color: "#374151",
            fontWeight: "600",
          }}
        >
          Select Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          style={{
            padding: "12px 14px",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            fontSize: "14px",
          }}
        />
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          {/* Revenue Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <RevenueCard
              title="Online Revenue"
              value={`₹${data?.onlineRevenue || 0}`}
            />

            <RevenueCard
              title="Cash Revenue"
              value={`₹${data?.cashRevenue || 0}`}
            />

            <RevenueCard
              title="Fine Revenue"
              value={`₹${data?.fineRevenue || 0}`}
            />

            <RevenueCard
              title="Refund Amount"
              value={`₹${data?.refundAmount || 0}`}
            />

            <RevenueCard
              title="Net Revenue"
              value={`₹${data?.netRevenue || 0}`}
            />

            <RevenueCard
              title="Transactions"
              value={data?.transactionCount || 0}
              clickable
              onClick={() => navigate("/revenue/transactions")}
            />
          </div>

          {/* Parking Revenue */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#111827",
                }}
              >
                Parking-wise Revenue
              </h2>
            </div>

            {parkingRevenue.length === 0 ? (
              <div
                style={{
                  padding: "20px",
                  color: "#6b7280",
                }}
              >
                No revenue data found.
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        background: "#f8fafc",
                        color: "#374151",
                      }}
                    >
                      Rank
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        background: "#f8fafc",
                        color: "#374151",
                      }}
                    >
                      Parking
                    </th>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        background: "#f8fafc",
                        color: "#374151",
                      }}
                    >
                      Revenue
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {parkingRevenue.map((parking, index) => (
                    <tr key={parking.parkingId}>
                      <td
                        style={{
                          padding: "16px",
                          borderTop: "1px solid #e5e7eb",
                        }}
                      >
                        #{index + 1}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          borderTop: "1px solid #e5e7eb",
                          fontWeight: "600",
                        }}
                      >
                        {parking.parkingName}
                      </td>

                      <td
                        style={{
                          padding: "16px",
                          borderTop: "1px solid #e5e7eb",
                          color: "#15803d",
                          fontWeight: "700",
                        }}
                      >
                        ₹{parking.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
