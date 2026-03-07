import { ACCENT, NAV, PRIMARY } from "../constants/appConstants";

export default function Sidebar({ page, setPage, user, alerts, onLogout }) {
  return (
    <div
      style={{
        width: 220,
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${PRIMARY} 0%, #134E4A 100%)`,
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ marginBottom: 32, paddingLeft: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: -0.5 }}>💰 Expensetrack</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 2 }}>Financial Manager</div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.map((n) => (
          <div
            key={n.id}
            className="nav-item"
            onClick={() => setPage(n.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: page === n.id ? "rgba(255,255,255,.2)" : "transparent",
              color: page === n.id ? "#fff" : "rgba(255,255,255,.65)",
              fontWeight: page === n.id ? 600 : 400,
              fontSize: 14,
            }}
          >
            <span style={{ fontSize: 17 }}>{n.icon}</span>
            {n.label}
          </div>
        ))}
        {user.role === "admin" && (
          <div
            className="nav-item"
            onClick={() => setPage("admin")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              background: page === "admin" ? "rgba(255,255,255,.2)" : "transparent",
              color: page === "admin" ? "#fff" : "rgba(255,255,255,.65)",
              fontWeight: page === "admin" ? 600 : 400,
              fontSize: 14,
            }}
          >
            <span style={{ fontSize: 17 }}>🛡️</span>Admin
          </div>
        )}
      </div>
      {alerts > 0 && (
        <div
          style={{
            background: "rgba(239,68,68,.25)",
            border: "1px solid rgba(239,68,68,.5)",
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 12,
            fontSize: 12,
            color: "#FCA5A5",
          }}
        >
          ⚠️ {alerts} budget alert{alerts > 1 ? "s" : ""}
        </div>
      )}
      <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", paddingTop: 16 }}>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", fontWeight: 600, paddingLeft: 4, marginBottom: 4 }}>{user.name}</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,.4)", paddingLeft: 4, marginBottom: 12 }}>{user.email}</div>
        <button
          className="nav-item btn-hover"
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 12px",
            background: "rgba(239,68,68,.2)",
            color: "#FCA5A5",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
          }}
        >
          🚪 Sign Out
        </button>
      </div>
    </div>
  );
}
