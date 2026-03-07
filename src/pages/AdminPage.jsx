import { useState } from "react";
import { ACCENT, CAT_ICONS, PRIMARY } from "../constants/appConstants";
import { fmt, fmtDate } from "../utils/formatters";
import StatCard from "../components/ui/StatCard";

export default function AdminPage({ txns, users }) {
  const [tab, setTab] = useState("transactions");
  const totalVolume = txns.reduce((s, t) => s + t.amount, 0);

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Admin Panel 🛡️</h1>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>System-wide management and monitoring</p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Users" value={users.length} icon="👥" color="#3B82F6" />
        <StatCard label="Total Transactions" value={txns.length} icon="💳" color={PRIMARY} />
        <StatCard label="Total Volume" value={fmt(totalVolume)} icon="💰" color="#10B981" />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["transactions", "users"].map((t) => (
          <button
            key={t}
            className="btn-hover"
            onClick={() => setTab(t)}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 13,
              border: "none",
              background: tab === t ? `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` : "#fff",
              color: tab === t ? "#fff" : "#64748B",
              boxShadow: tab === t ? "0 4px 14px rgba(15,118,110,.25)" : "0 2px 8px rgba(0,0,0,.05)",
            }}
          >
            {t === "transactions" ? "All Transactions" : "Manage Users"}
          </button>
        ))}
      </div>

      {tab === "transactions" && (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "12px 20px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
            {["User", "Description", "Category", "Date", "Amount"].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {[...txns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 30).map((t) => {
            const u = users.find((user) => user.id === t.userId);
            return (
              <div key={t.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", padding: "13px 20px", borderBottom: "1px solid #F8FAFC", alignItems: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{u?.name || "Unknown"}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{t.desc}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{CAT_ICONS[t.category]} {t.category}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>{fmtDate(t.date)}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: t.type === "income" ? "#10B981" : "#EF4444" }}>{t.type === "income" ? "+" : "-"}{fmt(t.amount)}</div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "users" && (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr", padding: "12px 20px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
            {["Name", "Email", "Role", "Joined"].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>
          {users.map((u) => (
            <div key={u.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr", padding: "14px 20px", borderBottom: "1px solid #F8FAFC", alignItems: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>👤 {u.name}</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{u.email}</div>
              <div>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: u.role === "admin" ? "#FEF3C7" : "#EFF6FF", color: u.role === "admin" ? "#D97706" : "#2563EB" }}>{u.role}</span>
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>{fmtDate(u.createdAt)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
