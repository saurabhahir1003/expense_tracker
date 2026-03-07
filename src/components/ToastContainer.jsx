export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{
            background: t.type === "error" ? "#FEF2F2" : t.type === "warning" ? "#FFFBEB" : "#F0FDF4",
            border: `1.5px solid ${t.type === "error" ? "#FCA5A5" : t.type === "warning" ? "#FCD34D" : "#86EFAC"}`,
            borderRadius: 12,
            padding: "12px 16px",
            minWidth: 280,
            maxWidth: 340,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 24px rgba(0,0,0,.1)",
          }}
        >
          <span style={{ fontSize: 18 }}>{t.type === "error" ? "🚨" : t.type === "warning" ? "⚠️" : "✅"}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{t.title}</div>
            {t.msg && <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{t.msg}</div>}
          </div>
          <button onClick={() => onDismiss(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 16 }}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
