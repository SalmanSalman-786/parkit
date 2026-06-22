import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Guards from "./pages/Guards";
import Parkings from "./pages/Parkings";
import Bookings from "./pages/Bookings";
import Revenue from "./pages/Revenue";
import ParkingDetails from "./pages/ParkingDetails";
import AddParking from "./pages/AddParking";
import EditParking from "./pages/EditParking";
import UserDetails from "./pages/UserDetails";
import BookingDetails from "./pages/BookingDetails";
import RevenueTransactions from "./pages/RevenueTransactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/guards" element={<Guards />} />
        <Route path="/parkings" element={<Parkings />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/revenue" element={<Revenue />} />
        <Route path="/parkings" element={<Parkings />} />
        <Route path="/parkings/:id" element={<ParkingDetails />} />
        <Route path="/parkings/add" element={<AddParking />} />
        <Route path="/parkings/edit/:id" element={<EditParking />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/bookings/:bookingId" element={<BookingDetails />} />
        <Route path="/revenue/transactions" element={<RevenueTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
