import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function Parkings() {
  const [parkings, setParkings] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadParkings();
  }, []);

  const loadParkings = async () => {
    try {
      const res = await api.get("/parking");
      setParkings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredParkings = parkings.filter(
    (parking) =>
      (parking.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (parking.location || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#111827",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Parking Locations
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
            }}
          >
            Manage all parking facilities
          </p>
        </div>

        <button
          onClick={() => navigate("/parkings/add")}
          style={{
            background: "#15803d",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Parking
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "14px",
          padding: "12px 18px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Search parking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "15px",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))",
          gap: "20px",
        }}
      >
        {filteredParkings.map((parking) => (
          <div
            key={parking.id}
            onClick={() => navigate(`/parkings/${parking.id}`)}
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              padding: "22px",
              cursor: "pointer",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "#111827",
                  fontSize: "18px",
                  fontWeight: "700",
                }}
              >
                {parking.name}
              </h3>

              <span
                style={{
                  background: parking.active ? "#dcfce7" : "#fee2e2",
                  color: parking.active ? "#166534" : "#991b1b",
                  padding: "6px 12px",
                  borderRadius: "30px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {parking.active ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            {/* Location */}
            <p
              style={{
                color: "#64748b",
                marginBottom: "20px",
              }}
            >
              {parking.location}
            </p>

            <hr />

            {/* Capacity */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "18px",
                  borderRadius: "14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  Two Wheeler
                </div>

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {parking.twoWheelerCapacity}
                </div>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  Slots
                </small>
              </div>

              <div
                style={{
                  background: "#f8fafc",
                  padding: "18px",
                  borderRadius: "14px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  Four Wheeler
                </div>

                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {parking.fourWheelerCapacity}
                </div>

                <small
                  style={{
                    color: "#64748b",
                  }}
                >
                  Slots
                </small>
              </div>
            </div>

            <hr
              style={{
                marginTop: "15px",
                marginBottom: "15px",
              }}
            />

            {/* Pricing */}
            <div
              style={{
                display: "grid",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#6b7280" }}>Bike Rate</span>

                <strong>₹{parking.bikeHourlyRate}/hr</strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "#6b7280" }}>Car Rate</span>

                <strong>₹{parking.carHourlyRate}/hr</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
