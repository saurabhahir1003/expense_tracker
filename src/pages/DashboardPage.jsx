import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATS, CAT_COLORS, CAT_ICONS, MONTHS } from "../constants/appConstants";
import { fmt, fmtDate } from "../utils/formatters";
import StatCard from "../components/ui/StatCard";

export default function DashboardPage({ txns, goals, user }) {
  const myTxns = txns.filter((t) => t.userId === user.id);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const monthTxns = myTxns.filter((t) => {
    const d = new Date(`${t.date}T12:00:00`);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });

  const totalIncome = monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5 + i);
    const m = d.getMonth();
    const y = d.getFullYear();
    const filtered = myTxns.filter((t) => {
      const td = new Date(`${t.date}T12:00:00`);
      return td.getMonth() === m && td.getFullYear() === y;
    });
    return {
      name: MONTHS[m],
      Income: filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      Expense: filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  const catData = CATS.map((c) => ({
    name: c,
    value: monthTxns.filter((t) => t.type === "expense" && t.category === c).reduce((s, t) => s + t.amount, 0),
  })).filter((c) => c.value > 0);

  const recentTxns = [...myTxns].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="fade" style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 700, fontSize: 24, color: "#0F172A" }}>Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {user.name.split(" ")[0]} 👋</h1>
        <p style={{ color: "#94A3B8", fontSize: 14, marginTop: 4 }}>Here's your financial overview for {MONTHS[thisMonth]} {thisYear}</p>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Income" value={fmt(totalIncome)} sub="This month" icon="💹" color="#10B981" />
        <StatCard label="Total Expenses" value={fmt(totalExpense)} sub="This month" icon="📉" color="#EF4444" />
        <StatCard label="Net Balance" value={fmt(balance)} sub="Income − Expenses" icon="🏦" color={balance >= 0 ? "#3B82F6" : "#F97316"} />
        <StatCard label="Active Goals" value={goals.filter((g) => g.userId === user.id && g.status === "active").length} sub="Savings targets" icon="🎯" color="#8B5CF6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>6-Month Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="iGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)} />
              <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,.1)", fontSize: 12 }} />
              <Area type="monotone" dataKey="Income" stroke="#10B981" strokeWidth={2} fill="url(#iGrad)" />
              <Area type="monotone" dataKey="Expense" stroke="#EF4444" strokeWidth={2} fill="url(#eGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 8 }}>Expenses by Category</div>
          {catData.length === 0 ? (
            <div style={{ color: "#CBD5E1", textAlign: "center", paddingTop: 60, fontSize: 13 }}>No expenses this month</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={catData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {catData.map((entry, i) => (
                    <Cell key={i} fill={CAT_COLORS[entry.name] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [fmt(v)]} contentStyle={{ borderRadius: 10, border: "none", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ fontSize: 11, color: "#64748B" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, padding: 22, boxShadow: "0 2px 12px rgba(0,0,0,.05)" }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: "#0F172A", marginBottom: 16 }}>Recent Transactions</div>
        {recentTxns.length === 0 ? (
          <div style={{ color: "#CBD5E1", textAlign: "center", padding: 32, fontSize: 13 }}>No transactions yet</div>
        ) : (
          recentTxns.map((t) => (
            <div key={t.id} className="row-hover" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 8px", borderRadius: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${CAT_COLORS[t.category]}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{CAT_ICONS[t.category]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>{t.desc}</div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.category} · {fmtDate(t.date)}</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: t.type === "income" ? "#10B981" : "#EF4444" }}>
                {t.type === "income" ? "+" : "-"}
                {fmt(t.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
