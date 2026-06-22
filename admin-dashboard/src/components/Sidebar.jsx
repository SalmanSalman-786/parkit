import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  SquareParking,
  BookOpen,
  IndianRupee,
  CarFront,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItem = (path, icon, label) => {
    const active = location.pathname.startsWith(path);

    return (
      <li style={{ marginBottom: "10px" }}>
        <Link
          to={path}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            color: active ? "#ffffff" : "#374151",
            padding: "12px 15px",
            borderRadius: "10px",
            background: active ? "#10b981" : "transparent",
            transition: "0.2s",
            fontWeight: active ? "600" : "500",
            transition: "all 0.2s ease",
          }}
        >
          <span>{icon}</span>
          <span>{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <div
      style={{
        width: "240px",
        background: "#ffffff",
        color: "#111827",
        borderRight: "1px solid #e5e7eb",
        minHeight: "100vh",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#10b981",
          }}
        >
          ParkIt
        </h2>

        <p
          style={{
            marginTop: "5px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          Admin Dashboard
        </p>
      </div>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {menuItem("/dashboard", <LayoutDashboard size={18} />, "Dashboard")}

        {menuItem("/users", <Users size={18} />, "Users")}

        {menuItem("/guards", <ShieldCheck size={18} />, "Guards")}

        {menuItem("/parkings", <SquareParking size={18} />, "Parking Lots")}

        {menuItem("/bookings", <BookOpen size={18} />, "Bookings")}

        {menuItem("/revenue", <IndianRupee size={18} />, "Revenue")}

     
      </ul>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          color: "#9ca3af",
          fontSize: "12px",
        }}
      >
        ParkIt v1.0
      </div>
    </div>
  );
}
