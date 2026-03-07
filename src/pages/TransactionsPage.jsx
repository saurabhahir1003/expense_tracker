import { useState } from "react";
import { ACCENT, CATS, CAT_ICONS, PRIMARY } from "../constants/appConstants";
import { fmt, fmtDate, today, uid } from "../utils/formatters";
import Modal from "../components/ui/Modal";
import FormField from "../components/ui/FormField";
import { inputStyle } from "../components/ui/formStyles";

export default function TransactionsPage({ txns, setTxns, user, budgets, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [filter, setFilter] = useState({ type: "all", category: "all", search: "" });
  const [form, setForm] = useState({ desc: "", amount: "", type: "expense", category: "Food", date: today(), notes: "" });

  const myTxns = txns.filter((t) => t.userId === user.id);

  const filtered = myTxns
    .filter((t) => {
      if (filter.type !== "all" && t.type !== filter.type) return false;
      if (filter.category !== "all" && t.category !== filter.category) return false;
      if (filter.search && !t.desc.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  function openAdd() {
    setForm({ desc: "", amount: "", type: "expense", category: "Food", date: today(), notes: "" });
    setEditTxn(null);
    setShowModal(true);
  }

  function openEdit(t) {
    setForm({ desc: t.desc, amount: String(t.amount), type: t.type, category: t.category, date: t.date, notes: t.notes || "" });
    setEditTxn(t);
    setShowModal(true);
  }

  function save() {
    if (!form.desc || !form.amount) return addToast("error", "Missing Fields", "Please fill description and amount.");

    const amt = parseFloat(parseFloat(form.amount).toFixed(2));
    if (isNaN(amt) || amt <= 0) return addToast("error", "Invalid Amount", "Amount must be a positive number.");

    if (editTxn) {
      setTxns((prev) => prev.map((t) => (t.id === editTxn.id ? { ...t, ...form, amount: amt } : t)));
      addToast("success", "Updated", "Transaction updated successfully.");
      setShowModal(false);
      return;
    }

    const newTxn = { id: uid(), userId: user.id, ...form, amount: amt };
    setTxns((prev) => [...prev, newTxn]);

    if (form.type === "expense") {
      const budget = budgets.find((b) => b.userId === user.id && b.category === form.category);
      if (budget) {
        const spent = txns.filter((t) => t.userId === user.id && t.type === "expense" && t.category === form.category).reduce((s, t) => s + t.amount, 0) + amt;
        if (spent > budget.limitAmount) addToast("warning", "Budget Exceeded!", `${form.category} budget of ${fmt(budget.limitAmount)} exceeded!`);
        else if (spent > budget.limitAmount * 0.8) addToast("warning", "Budget Warning", `${form.category} is at ${Math.round((spent / budget.limitAmount) * 100)}% of budget.`);
      }
    }

    addToast("success", "Added", "Transaction recorded.");
    setShowModal(false);
  }

  function del(id) {
    setTxns((prev) => prev.filter((t) => t.id !== id));
    addToast("success", "Deleted", "Transaction removed.");
  }

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Transactions</h1>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>{filtered.length} record{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button className="btn-hover" onClick={openAdd} style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 14px rgba(15,118,110,.3)" }}>
          + Add Transaction
        </button>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, maxWidth: 220 }} placeholder="🔍 Search..." value={filter.search} onChange={(e) => setFilter((f) => ({ ...f, search: e.target.value }))} />
        <select style={{ ...inputStyle, maxWidth: 140 }} value={filter.type} onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select style={{ ...inputStyle, maxWidth: 160 }} value={filter.category} onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}>
          <option value="all">All Categories</option>
          {CATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,.05)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", padding: "12px 20px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
          {["Description", "Category", "Date", "Type", "Amount", ""].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#CBD5E1", fontSize: 14 }}>No transactions found</div>
        ) : (
          filtered.map((t) => (
            <div key={t.id} className="row-hover" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", padding: "14px 20px", borderBottom: "1px solid #F8FAFC", alignItems: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{t.desc}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 14 }}>{CAT_ICONS[t.category]}</span>
                <span style={{ fontSize: 13, color: "#64748B" }}>{t.category}</span>
              </div>
              <div style={{ fontSize: 13, color: "#64748B" }}>{fmtDate(t.date)}</div>
              <div>
                <span style={{ padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, background: t.type === "income" ? "#DCFCE7" : "#FEE2E2", color: t.type === "income" ? "#16A34A" : "#DC2626" }}>{t.type}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: t.type === "income" ? "#10B981" : "#EF4444" }}>
                {t.type === "income" ? "+" : "-"}
                {fmt(t.amount)}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn-hover" onClick={() => openEdit(t)} style={{ background: "#EFF6FF", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>
                  ✏️
                </button>
                <button className="btn-hover" onClick={() => del(t.id)} style={{ background: "#FEF2F2", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 13 }}>
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <Modal title={editTxn ? "Edit Transaction" : "New Transaction"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <FormField label="Description">
                <input style={inputStyle} value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} placeholder="e.g. Grocery run" />
              </FormField>
            </div>
            <FormField label="Amount">
              <input style={inputStyle} type="number" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </FormField>
            <FormField label="Type">
              <select style={inputStyle} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </FormField>
            <FormField label="Category">
              <select style={inputStyle} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATS.map((c) => (
                  <option key={c} value={c}>
                    {CAT_ICONS[c]} {c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Date">
              <input style={inputStyle} type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </FormField>
            <div style={{ gridColumn: "1/-1" }}>
              <FormField label="Notes (optional)">
                <input style={inputStyle} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder="Any additional notes" />
              </FormField>
            </div>
          </div>
          <button className="btn-hover" onClick={save} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", marginTop: 8 }}>
            {editTxn ? "Save Changes" : "Add Transaction"}
          </button>
        </Modal>
      )}
    </div>
  );
}
