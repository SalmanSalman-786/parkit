export default function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      style={{
        height: "80px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      {/* Left */}
      <div>
        <h2
          style={{
            margin: 0,
            color: "#111827",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
           Dashboard
        </h2>

        <small
          style={{
            color: "#64748b",
          }}
        >
          Welcome back, Admin
        </small>
      </div>

      {/* Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Search */}
        <div
          style={{
            width: "260px",
            height: "42px",
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          Search...
        </div>

        {/* Notification */}
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          🔔
        </div>

        {/* Avatar */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#10b981",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
          }}
        >
          A
        </div>

        {/* User Info */}
        <div>
          <div
            style={{
              fontWeight: "600",
              color: "#111827",
              fontSize: "14px",
            }}
          >
            Admin
          </div>

          <div
            style={{
              color: "#6b7280",
              fontSize: "12px",
            }}
          >
            Administrator
          </div>
        </div>
      </div>
    </div>
  );
}
