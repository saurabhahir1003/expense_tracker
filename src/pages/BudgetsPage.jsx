import { useState } from "react";
import { ACCENT, CATS, CAT_COLORS, CAT_ICONS, MONTHS, PRIMARY } from "../constants/appConstants";
import { fmt, uid } from "../utils/formatters";
import Modal from "../components/ui/Modal";
import FormField from "../components/ui/FormField";
import { inputStyle } from "../components/ui/formStyles";

export default function BudgetsPage({ budgets, setBudgets, txns, user, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [form, setForm] = useState({ category: "Food", limitAmount: "", period: "monthly" });

  const myBudgets = budgets.filter((b) => b.userId === user.id);
  const now = new Date();

  function getSpent(category) {
    return txns
      .filter((t) => t.userId === user.id && t.type === "expense" && t.category === category && new Date(`${t.date}T12:00:00`).getMonth() === now.getMonth())
      .reduce((s, t) => s + t.amount, 0);
  }

  function save() {
    if (!form.limitAmount || isNaN(+form.limitAmount) || +form.limitAmount <= 0) return addToast("error", "Invalid", "Enter a valid limit amount.");

    if (editBudget) {
      setBudgets((prev) => prev.map((b) => (b.id === editBudget.id ? { ...b, ...form, limitAmount: +form.limitAmount } : b)));
      addToast("success", "Updated", "Budget updated.");
      setShowModal(false);
      return;
    }

    if (myBudgets.find((b) => b.category === form.category)) return addToast("error", "Exists", "Budget for this category already exists.");

    setBudgets((prev) => [...prev, { id: uid(), userId: user.id, ...form, limitAmount: +form.limitAmount }]);
    addToast("success", "Created", "Budget created.");
    setShowModal(false);
  }

  function del(id) {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
    addToast("success", "Deleted", "Budget removed.");
  }

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Budgets</h1>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>Track your spending limits for {MONTHS[now.getMonth()]}</p>
        </div>
        <button className="btn-hover" onClick={() => { setEditBudget(null); setForm({ category: "Food", limitAmount: "", period: "monthly" }); setShowModal(true); }} style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 14 }}>
          + Set Budget
        </button>
      </div>

      {myBudgets.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 64, textAlign: "center", color: "#CBD5E1", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No budgets set yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Create a budget to track your spending limits</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {myBudgets.map((b) => {
            const spent = getSpent(b.category);
            const pct = Math.min(100, Math.round((spent / b.limitAmount) * 100));
            const over = spent > b.limitAmount;
            const warn = pct >= 80;
            return (
              <div key={b.id} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)", borderTop: `4px solid ${over ? "#EF4444" : warn ? "#F59E0B" : CAT_COLORS[b.category] || PRIMARY}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 26 }}>{CAT_ICONS[b.category]}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A" }}>{b.category}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{b.period}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-hover" onClick={() => { setEditBudget(b); setForm({ category: b.category, limitAmount: String(b.limitAmount), period: b.period }); setShowModal(true); }} style={{ background: "#EFF6FF", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 12 }}>✏️</button>
                    <button className="btn-hover" onClick={() => del(b.id)} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 12 }}>🗑</button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Spent: <strong style={{ color: over ? "#EF4444" : "#0F172A" }}>{fmt(spent)}</strong></span>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Limit: <strong>{fmt(b.limitAmount)}</strong></span>
                </div>
                <div style={{ background: "#F1F5F9", borderRadius: 99, height: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: over ? "#EF4444" : warn ? "#F59E0B" : CAT_COLORS[b.category] || PRIMARY, transition: "width .6s ease" }} />
                </div>
                <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: over ? "#EF4444" : warn ? "#F59E0B" : "#64748B" }}>{over ? "⚠️ Over budget!" : warn ? "⚠️ Almost at limit" : `${pct}%  used`}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{fmt(Math.max(0, b.limitAmount - spent))} left</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editBudget ? "Edit Budget" : "New Budget"} onClose={() => setShowModal(false)}>
          <FormField label="Category">
            <select style={inputStyle} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} disabled={!!editBudget}>
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {CAT_ICONS[c]} {c}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Monthly Limit (₹)">
            <input style={inputStyle} type="number" value={form.limitAmount} onChange={(e) => setForm((f) => ({ ...f, limitAmount: e.target.value }))} placeholder="e.g. 3000" />
          </FormField>
          <button className="btn-hover" onClick={save} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>
            {editBudget ? "Save Changes" : "Create Budget"}
          </button>
        </Modal>
      )}
    </div>
  );
}
