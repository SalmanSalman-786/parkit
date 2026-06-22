import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function WalkInDetails() {

  const { vehicleNumber } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {

    const token =
      localStorage.getItem("token");

    const res = await api.get(
      `/admin/walkins/${vehicleNumber}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    setData(res.data);
  };

  if (!data) {
    return (
      <AdminLayout>
        Loading...
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <h2>{data.vehicleNumber}</h2>

      <p>
        📞 {data.phoneNumber}
      </p>

      <p>
        Total Walk-ins:
        {data.walkinCount}
      </p>

      <p>
        Total Paid:
        ₹{data.totalAmount}
      </p>

      <hr />

      <h3>History</h3>

      {data.history.map((booking) => (

        <div
          key={booking.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}
        >

          <p>
            Parking:
            {booking.parkingName}
          </p>

          <p>
            Amount:
            ₹{booking.amount}
          </p>

          <p>
            Status:
            {booking.status}
          </p>

          <p>
            Entry:
            {booking.entryTime}
          </p>

          <p>
            Exit:
            {booking.exitTime}
          </p>

        </div>

      ))}

    </AdminLayout>
  );
}