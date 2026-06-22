import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

export default function BookingDetails() {

  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res = await api.get(
        `/admin/bookings/${bookingId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setBooking(res.data);

    } catch (err) {

      console.error(err);

    }
  };

  if (!booking) {
    return (
      <AdminLayout>
        Loading...
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <h2>Booking Details</h2>

      <hr />

      <p>
        <b>Booking ID:</b>
        {booking.bookingId}
      </p>

      <p>
        <b>Vehicle Number:</b>
        {booking.vehicleNumber}
      </p>

      <p>
        <b>Vehicle Type:</b>
        {booking.vehicleType}
      </p>

      <p>
        <b>Parking:</b>
        {booking.parkingName}
      </p>

      <p>
        <b>Status:</b>
        {booking.status}
      </p>

      <hr />

      <p>
        <b>Phone:</b>
        {booking.phone}
      </p>

      <hr />

      <p>
        <b>Amount:</b>
        ₹{booking.amount}
      </p>

      <p>
        <b>Fine:</b>
        ₹{booking.fineAmount}
      </p>

      <hr />

      <p>
        <b>Start Time:</b>
        {booking.startTime}
      </p>

      <p>
        <b>Entry Time:</b>
        {booking.entryTime}
      </p>

      <p>
        <b>Exit Time:</b>
        {booking.exitTime}
      </p>

    </AdminLayout>
  );
}