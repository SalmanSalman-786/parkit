import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function AddParking() {
  const navigate = useNavigate();

  const [parking, setParking] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    twoWheelerCapacity: "",
    fourWheelerCapacity: "",
    bookingCapacityCars: "",
    bookingCapacityBikes: "",
    bikeHourlyRate: 10,
    carHourlyRate: 20,
  });

  const [imageFile, setImageFile] = useState(null);

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const saveParking = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();

        formData.append("file", imageFile);

        const uploadResponse = await api.post("/parking/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = uploadResponse.data;
      }

      await api.post(
        "/parking",
        {
          ...parking,

          imageUrl,

          twoWheelerAvailable: parking.twoWheelerCapacity,

          fourWheelerAvailable: parking.fourWheelerCapacity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Parking Added");

      navigate("/parkings");
    } catch (err) {
      console.error(err);
      alert("Failed to add parking");
    }
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
          Add Parking
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "5px",
          }}
        >
          Create a new parking facility
        </p>
      </div>

      <form onSubmit={saveParking}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "28px",
          }}
        >
          {/* Basic Info */}
          <h3
            style={{
              marginTop: 0,
              color: "#111827",
            }}
          >
            Basic Information
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <input
              style={inputStyle}
              placeholder="Parking Name"
              value={parking.name}
              onChange={(e) =>
                setParking({
                  ...parking,
                  name: e.target.value,
                })
              }
            />

            <input
              style={inputStyle}
              placeholder="Location"
              value={parking.location}
              onChange={(e) =>
                setParking({
                  ...parking,
                  location: e.target.value,
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              step="0.000001"
              placeholder="Latitude"
              value={parking.latitude}
              onChange={(e) =>
                setParking({
                  ...parking,
                  latitude: e.target.value,
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              step="0.000001"
              placeholder="Longitude"
              value={parking.longitude}
              onChange={(e) =>
                setParking({
                  ...parking,
                  longitude: e.target.value,
                })
              }
            />
          </div>

          {/* Capacity */}
          <h3
            style={{
              color: "#111827",
            }}
          >
            Capacity
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <input
              style={inputStyle}
              type="number"
              placeholder="Two Wheeler Capacity"
              value={parking.twoWheelerCapacity}
              onChange={(e) =>
                setParking({
                  ...parking,
                  twoWheelerCapacity: Number(e.target.value),
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              placeholder="Four Wheeler Capacity"
              value={parking.fourWheelerCapacity}
              onChange={(e) =>
                setParking({
                  ...parking,
                  fourWheelerCapacity: Number(e.target.value),
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              placeholder="Booking Capacity Cars"
              value={parking.bookingCapacityCars}
              onChange={(e) =>
                setParking({
                  ...parking,
                  bookingCapacityCars: Number(e.target.value),
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              placeholder="Booking Capacity Bikes"
              value={parking.bookingCapacityBikes}
              onChange={(e) =>
                setParking({
                  ...parking,
                  bookingCapacityBikes: Number(e.target.value),
                })
              }
            />
          </div>

          {/* Pricing */}
          <h3
            style={{
              color: "#111827",
            }}
          >
            Pricing
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            <input
              style={inputStyle}
              type="number"
              placeholder="Bike Hourly Rate"
              value={parking.bikeHourlyRate}
              onChange={(e) =>
                setParking({
                  ...parking,
                  bikeHourlyRate: Number(e.target.value),
                })
              }
            />

            <input
              style={inputStyle}
              type="number"
              placeholder="Car Hourly Rate"
              value={parking.carHourlyRate}
              onChange={(e) =>
                setParking({
                  ...parking,
                  carHourlyRate: Number(e.target.value),
                })
              }
            />
          </div>

          <h3
            style={{
              color: "#111827",
            }}
          >
            Parking Image
          </h3>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            <button
              type="submit"
              style={{
                background: "#15803d",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Parking
            </button>

            <button
              type="button"
              onClick={() => navigate("/parkings")}
              style={{
                background: "#f3f4f6",
                color: "#111827",
                border: "1px solid #e5e7eb",
                padding: "12px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
