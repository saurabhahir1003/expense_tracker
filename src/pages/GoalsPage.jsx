import { useState } from "react";
import { ACCENT, PRIMARY } from "../constants/appConstants";
import { fmt, uid } from "../utils/formatters";
import Modal from "../components/ui/Modal";
import FormField from "../components/ui/FormField";
import { inputStyle } from "../components/ui/formStyles";

export default function GoalsPage({ goals, setGoals, user, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editGoal, setEditGoal] = useState(null);
  const [addFunds, setAddFunds] = useState(null);
  const [fundAmt, setFundAmt] = useState("");
  const [form, setForm] = useState({ name: "", targetAmount: "", savedAmount: "0", deadline: "", status: "active" });

  const myGoals = goals.filter((g) => g.userId === user.id);

  function save() {
    if (!form.name || !form.targetAmount || !form.deadline) return addToast("error", "Missing", "Fill all required fields.");
    const payload = { ...form, targetAmount: +form.targetAmount, savedAmount: +form.savedAmount };

    if (editGoal) {
      setGoals((prev) => prev.map((g) => (g.id === editGoal.id ? { ...g, ...payload } : g)));
      addToast("success", "Updated", "Goal updated.");
    } else {
      setGoals((prev) => [...prev, { id: uid(), userId: user.id, ...payload }]);
      addToast("success", "Created", "Goal created!");
    }

    setShowModal(false);
  }

  function contribute() {
    const amt = parseFloat(fundAmt);
    if (!amt || amt <= 0) return addToast("error", "Invalid", "Enter a valid amount.");

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== addFunds.id) return g;
        const newSaved = Math.min(g.savedAmount + amt, g.targetAmount);
        const done = newSaved >= g.targetAmount;
        if (done) addToast("success", "🎉 Goal Reached!", `You've completed your "${g.name}" goal!`);
        return { ...g, savedAmount: newSaved, status: done ? "completed" : "active" };
      })
    );

    setAddFunds(null);
    setFundAmt("");
  }

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Savings Goals</h1>
          <p style={{ color: "#94A3B8", fontSize: 13 }}>Track your financial milestones</p>
        </div>
        <button className="btn-hover" onClick={() => { setEditGoal(null); setForm({ name: "", targetAmount: "", savedAmount: "0", deadline: "", status: "active" }); setShowModal(true); }} style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", border: "none", borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 14 }}>
          + New Goal
        </button>
      </div>

      {myGoals.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: 64, textAlign: "center", color: "#CBD5E1", boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>No goals yet</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Set a savings goal and start tracking your progress</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))", gap: 16 }}>
          {myGoals.map((g) => {
            const pct = Math.round((g.savedAmount / g.targetAmount) * 100);
            const daysLeft = Math.ceil((new Date(g.deadline) - new Date()) / 86400000);
            const done = g.status === "completed";
            return (
              <div key={g.id} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,.05)", position: "relative", overflow: "hidden" }}>
                {done && <div style={{ position: "absolute", top: 0, right: 0, background: "#10B981", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: "0 16px 0 10px" }}>COMPLETED ✓</div>}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: "#0F172A", marginBottom: 4 }}>🚀 {g.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{done ? "Goal completed! 🎉" : daysLeft > 0 ? `${daysLeft} days remaining` : "Deadline passed"}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>Saved</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: PRIMARY }}>{fmt(g.savedAmount)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>Target</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#0F172A" }}>{fmt(g.targetAmount)}</div>
                  </div>
                </div>
                <div style={{ background: "#F1F5F9", borderRadius: 99, height: 10, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: `linear-gradient(90deg, ${PRIMARY}, ${ACCENT})`, transition: "width .8s ease" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: PRIMARY }}>{pct}% reached</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{fmt(g.targetAmount - g.savedAmount)} to go</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!done && <button className="btn-hover" onClick={() => { setAddFunds(g); setFundAmt(""); }} style={{ flex: 1, padding: "9px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 13 }}>+ Add Funds</button>}
                  <button className="btn-hover" onClick={() => { setEditGoal(g); setForm({ name: g.name, targetAmount: String(g.targetAmount), savedAmount: String(g.savedAmount), deadline: g.deadline, status: g.status }); setShowModal(true); }} style={{ padding: "9px 14px", background: "#F1F5F9", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button className="btn-hover" onClick={() => { setGoals((prev) => prev.filter((x) => x.id !== g.id)); addToast("success", "Deleted", "Goal removed."); }} style={{ padding: "9px 14px", background: "#FEF2F2", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 13 }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editGoal ? "Edit Goal" : "New Savings Goal"} onClose={() => setShowModal(false)}>
          <FormField label="Goal Name">
            <input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Emergency Fund" />
          </FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Target Amount (₹)">
              <input style={inputStyle} type="number" value={form.targetAmount} onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))} placeholder="50000" />
            </FormField>
            <FormField label="Already Saved (₹)">
              <input style={inputStyle} type="number" value={form.savedAmount} onChange={(e) => setForm((f) => ({ ...f, savedAmount: e.target.value }))} placeholder="0" />
            </FormField>
          </div>
          <FormField label="Deadline">
            <input style={inputStyle} type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          </FormField>
          <button className="btn-hover" onClick={save} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>
            {editGoal ? "Save Changes" : "Create Goal"}
          </button>
        </Modal>
      )}

      {addFunds && (
        <Modal title={`Add Funds — ${addFunds.name}`} onClose={() => setAddFunds(null)}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 28, color: PRIMARY }}>{Math.round((addFunds.savedAmount / addFunds.targetAmount) * 100)}%</div>
            <div style={{ fontSize: 13, color: "#94A3B8" }}>
              {fmt(addFunds.savedAmount)} of {fmt(addFunds.targetAmount)}
            </div>
          </div>
          <FormField label="Amount to Add (₹)">
            <input style={inputStyle} type="number" value={fundAmt} onChange={(e) => setFundAmt(e.target.value)} placeholder="e.g. 5000" autoFocus />
          </FormField>
          <button className="btn-hover" onClick={contribute} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none" }}>
            Add Funds 💰
          </button>
        </Modal>
      )}
    </div>
  );
}
