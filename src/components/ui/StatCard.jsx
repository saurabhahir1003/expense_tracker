export default function StatCard({ label, value, sub, icon, color, onClick }) {
  return (
    <div
      className="card-hover"
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px 22px",
        flex: 1,
        minWidth: 160,
        boxShadow: "0 2px 12px rgba(0,0,0,.05)",
        cursor: onClick ? "pointer" : "default",
        borderLeft: `4px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#0F172A" }}>{value}</div>
          {sub && <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>{icon}</div>
      </div>
    </div>
  );
}
