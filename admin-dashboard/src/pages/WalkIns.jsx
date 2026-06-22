import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function WalkIns() {
  const [walkins, setWalkins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWalkins();
  }, []);

  const loadWalkins = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/admin/walkins", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setWalkins(res.data);
  };

  return (
    <AdminLayout>
      <h2>Walk-In Users</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {walkins.map((walkin) => (
          <div
            key={walkin.vehicleNumber}
            onClick={() => navigate(`/walkins/${walkin.vehicleNumber}`)}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h3>{walkin.vehicleNumber}</h3>

            <p>📞 {walkin.phoneNumber}</p>

            <p>
              Walk-ins:
              {walkin.walkinCount}
            </p>

            <p>₹ {walkin.totalAmount}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
