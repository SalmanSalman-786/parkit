import {
  Users,
  ShieldCheck,
  SquareParking,
  CalendarCheck,
  CarFront,
  IndianRupee,
} from "lucide-react";
export default function StatCard({ title, value, icon = "📊", subtitle = "" }) {
  const getIcon = () => {
    switch (title) {
      case "Total Users":
        return <Users size={20} color="#10b981" />;

      case "Total Guards":
        return <ShieldCheck size={20} color="#10b981" />;

      case "Parking Lots":
        return <SquareParking size={20} color="#10b981" />;

      case "Active Bookings":
        return <CalendarCheck size={20} color="#10b981" />;

      case "Vehicles Inside":
        return <CarFront size={20} color="#10b981" />;

      case "Today's Revenue":
        return <IndianRupee size={20} color="#10b981" />;

      default:
        return <Users size={20} color="#10b981" />;
    }
  };
  return (
    <div
      style={{
        transition: "all 0.2s ease",
        cursor: "pointer",
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span
          style={{
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          {title}
        </span>

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "#ecfdf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {getIcon()}
        </div>
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "8px",
          color: "#9ca3af",
          fontSize: "13px",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}
