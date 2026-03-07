import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATS, CAT_COLORS, CAT_ICONS, MONTHS } from "../constants/appConstants";
import { fmt } from "../utils/formatters";
import StatCard from "../components/ui/StatCard";

export default function AnalyticsPage({ txns, user }) {
  const myTxns = txns.filter((t) => t.userId === user.id);

  const monthlyBar = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    const m = d.getMonth();
    const y = d.getFullYear();
    const f = myTxns.filter((t) => {
      const td = new Date(`${t.date}T12:00:00`);
      return td.getMonth() === m && td.getFullYear() === y;
    });
    return {
      name: MONTHS[m],
      Income: f.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expense: f.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const catBar = CATS.map((c) => ({
    name: c,
    amount: myTxns.filter((t) => t.type === "expense" && t.category === c).reduce((s, t) => s + t.amount, 0),
  }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const totalIncome = myTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = myTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 700, fontSize: 22, color: "#0F172A" }}>Analytics</h1>
        <p style={{ color: "#94A3B8", fontSize: 13 }}>Deep insights into your financial patterns</p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Income (All Time)" value={fmt(totalIncome)} icon="💹" color="#10B981" />
        <StatCard label="Total Expenses (All Time)" value={fmt(totalExpense)} icon="📉" color="#EF4444" />
        <StatCard label="Net Savings" value={fmt(savings)} icon="🏦" color={savings >= 0 ? "#3B82F6" : "#F97316"} />
        <StatCard label="Savings Rate" value={`${savingsRate}%`} sub="of total income" icon="📊" color="#8B5CF6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Monthly Income vs Expense</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyBar} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
              <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Expense" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Spending by Category</div>
          {catBar.length === 0 ? (
            <div style={{ color: "#CBD5E1", textAlign: "center", padding: 60, fontSize: 13 }}>No expense data</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {catBar.slice(0, 6).map((c) => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 70, fontSize: 12, color: "#64748B", textAlign: "right", flexShrink: 0 }}>{CAT_ICONS[c.name]} {c.name}</div>
                  <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 99, height: 8, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 99, background: CAT_COLORS[c.name], width: `${(c.amount / catBar[0].amount) * 100}%`, transition: "width .8s ease" }} />
                  </div>
                  <div style={{ width: 80, fontSize: 12, color: "#64748B", textAlign: "right", flexShrink: 0 }}>{fmt(c.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Spending Pattern by Day of Week</div>
        {(() => {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const byDay = days.map((d, i) => ({
            day: d,
            amount: myTxns.filter((t) => t.type === "expense" && new Date(`${t.date}T12:00:00`).getDay() === i).reduce((s, t) => s + t.amount, 0),
          }));
          const max = Math.max(...byDay.map((d) => d.amount), 1);
          return (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              {byDay.map((d) => (
                <div key={d.day} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>{fmt(d.amount)}</div>
                  <div style={{ background: `rgba(15,118,110,${0.15 + 0.85 * (d.amount / max)})`, borderRadius: "6px 6px 0 0", height: `${40 + 100 * (d.amount / max)}px`, transition: "height .6s ease" }} />
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", marginTop: 6 }}>{d.day}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
