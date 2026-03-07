import { useState } from "react";
import { ACCENT, PRIMARY } from "../constants/appConstants";
import { fmt, today } from "../utils/formatters";
import FormField from "../components/ui/FormField";
import { inputStyle } from "../components/ui/formStyles";

export default function ExportPage({ txns, user, addToast }) {
  const [range, setRange] = useState({ from: "2026-01-01", to: today() });

  const myTxns = txns
    .filter((t) => t.userId === user.id && t.date >= range.from && t.date <= range.to)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  function downloadCSV() {
    const header = "Date,Description,Type,Category,Amount,Notes";
    const rows = myTxns.map((t) => `${t.date},"${t.desc}",${t.type},${t.category},${t.amount},"${t.notes || ""}"`);
    const csv = [header, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expensetrack_${range.from}_${range.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    addToast("success", "Exported!", `${myTxns.length} transactions exported as CSV.`);
  }

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Export Data</h1>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>Download your transaction history</p>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 2px 12px rgba(0,0,0,.05)", maxWidth: 520 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <FormField label="From Date">
            <input style={inputStyle} type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
          </FormField>
          <FormField label="To Date">
            <input style={inputStyle} type="date" value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
          </FormField>
        </div>

        <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#64748B", marginBottom: 4 }}>
            Preview: <strong style={{ color: "#0F172A" }}>{myTxns.length} transactions</strong> in selected range
          </div>
          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            Income: {fmt(myTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0))} &nbsp;·&nbsp; Expense: {fmt(myTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0))}
          </div>
        </div>

        <button className="btn-hover" onClick={downloadCSV} style={{ width: "100%", padding: "13px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", boxShadow: "0 4px 14px rgba(15,118,110,.3)" }}>
          📥 Download CSV
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "#CBD5E1", marginTop: 10 }}>PDF export coming soon</p>
      </div>
    </div>
  );
}
