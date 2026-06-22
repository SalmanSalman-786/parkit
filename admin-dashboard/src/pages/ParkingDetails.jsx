import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

function InfoItem({ label, value }) {
  return (
    <div>
      <div
        style={{
          color: "#6b7280",
          fontSize: "13px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#111827",
          fontWeight: "600",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function ParkingDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [parking, setParking] = useState(null);

  useEffect(() => {
    loadParking();
  }, [id]);

  const loadParking = async () => {
    try {
      const res = await api.get(`/parking/${id}`);

      setParking(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteParking = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this parking location?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/parking/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Parking deleted successfully");

      navigate("/parkings");
    } catch (err) {
      console.error(err);

      alert("Failed to delete parking");
    }
  };

  if (!parking) {
    return (
      <AdminLayout>
        <h2>Loading...</h2>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div
        style={{
          background: "#ffffff",
          padding: "28px",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            {parking.name}
          </h1>

          <span
            style={{
              background: parking.active ? "#dcfce7" : "#fee2e2",
              color: parking.active ? "#166534" : "#991b1b",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {parking.active ? "Active" : "Inactive"}
          </span>
        </div>

        <p
          style={{
            color: "#64748b",
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          {parking.location}
        </p>
      </div>

      {/* Availability Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        {/* Two Wheeler */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Two Wheeler Availability
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {parking.twoWheelerAvailable}
          </div>

          <div
            style={{
              color: "#6b7280",
              marginTop: "6px",
            }}
          >
            of {parking.twoWheelerCapacity} slots available
          </div>

          <div
            style={{
              marginTop: "12px",
              color: "#15803d",
              fontWeight: "600",
            }}
          >
            Occupied: {parking.twoWheelerCapacity - parking.twoWheelerAvailable}
          </div>
        </div>

        {/* Four Wheeler */}
        <div
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "20px",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          >
            Four Wheeler Availability
          </div>

          <div
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {parking.fourWheelerAvailable}
          </div>

          <div
            style={{
              color: "#6b7280",
              marginTop: "6px",
            }}
          >
            of {parking.fourWheelerCapacity} slots available
          </div>

          <div
            style={{
              marginTop: "12px",
              color: "#15803d",
              fontWeight: "600",
            }}
          >
            Occupied:{" "}
            {parking.fourWheelerCapacity - parking.fourWheelerAvailable}
          </div>
        </div>
      </div>

      {/* Information */}
      <div
        style={{
          background: "#ffffff",
          padding: "28px",
          borderRadius: "20px",
          border: "1px solid #e5e7eb",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "20px",
            color: "#111827",
          }}
        >
          Parking Information
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "24px",
          }}
        >
          <InfoItem label="Location" value={parking.location} />

          <InfoItem label="Latitude" value={parking.latitude} />

          <InfoItem label="Longitude" value={parking.longitude} />

          <InfoItem
            label="Booking Capacity Cars"
            value={parking.bookingCapacityCars}
          />

          <InfoItem
            label="Booking Capacity Bikes"
            value={parking.bookingCapacityBikes}
          />

          <InfoItem
            label="Bike Hourly Rate"
            value={`₹${parking.bikeHourlyRate}/hour`}
          />

          <InfoItem
            label="Car Hourly Rate"
            value={`₹${parking.carHourlyRate}/hour`}
          />

          <InfoItem
            label="Status"
            value={parking.active ? "Active" : "Inactive"}
          />
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <button
          onClick={() => navigate(`/parkings/edit/${parking.id}`)}
          style={{
            background: "#15803d",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Edit Parking
        </button>

        <button
          onClick={deleteParking}
          style={{
            background: "#dc2626",
            color: "white",
            border: "none",
            padding: "12px 22px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Delete Parking
        </button>
      </div>
    </AdminLayout>
  );
}
