import { useCallback, useEffect, useMemo, useState } from "react";
import { SEED_BUDGETS, SEED_GOALS, SEED_TXN, SEED_USERS } from "./data/seedData";
import { GLOBAL_STYLE } from "./styles/globalStyles";
import { uid } from "./utils/formatters";
import { readStored, removeStored, STORAGE_KEYS, writeStored } from "./utils/storage";
import ToastContainer from "./components/ToastContainer";
import Sidebar from "./components/Sidebar";
import TokenBanner from "./components/TokenBanner";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";
import GoalsPage from "./pages/GoalsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ExportPage from "./pages/ExportPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [users, setUsers] = useState(() => readStored(STORAGE_KEYS.users, SEED_USERS));
  const [txns, setTxns] = useState(() => readStored(STORAGE_KEYS.txns, SEED_TXN));
  const [budgets, setBudgets] = useState(() => readStored(STORAGE_KEYS.budgets, SEED_BUDGETS));
  const [goals, setGoals] = useState(() => readStored(STORAGE_KEYS.goals, SEED_GOALS));
  const [user, setUser] = useState(() => readStored(STORAGE_KEYS.user, null));
  const [page, setPage] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    writeStored(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    writeStored(STORAGE_KEYS.txns, txns);
  }, [txns]);

  useEffect(() => {
    writeStored(STORAGE_KEYS.budgets, budgets);
  }, [budgets]);

  useEffect(() => {
    writeStored(STORAGE_KEYS.goals, goals);
  }, [goals]);

  useEffect(() => {
    if (user) writeStored(STORAGE_KEYS.user, user);
    else removeStored(STORAGE_KEYS.user);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const existing = users.find((u) => u.id === user.id);
    if (!existing) {
      setUser(null);
      return;
    }
    if (existing.name !== user.name || existing.email !== user.email || existing.role !== user.role) {
      setUser(existing);
    }
  }, [users, user]);

  const addToast = useCallback((type, title, msg) => {
    const id = uid();
    setToasts((p) => [...p, { id, type, title, msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismissToast = useCallback((id) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const budgetAlerts = useMemo(
    () =>
      budgets.filter((b) => {
        if (!user || b.userId !== user.id) return false;
        const now = new Date();
        const spent = txns
          .filter((t) => t.userId === user.id && t.type === "expense" && t.category === b.category && new Date(`${t.date}T12:00:00`).getMonth() === now.getMonth())
          .reduce((s, t) => s + t.amount, 0);
        return spent >= b.limitAmount * 0.8;
      }).length,
    [budgets, txns, user]
  );

  if (!user) {
    return (
      <>
        <style>{GLOBAL_STYLE}</style>
        <AuthPage
          users={users}
          onLogin={(u, updatedUsers) => {
            setUser(u);
            setUsers(updatedUsers);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Sora', sans-serif", background: "#F0F4F8" }}>
      <style>{GLOBAL_STYLE}</style>
      <Sidebar page={page} setPage={setPage} user={user} alerts={budgetAlerts} onLogout={() => setUser(null)} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowX: "hidden" }}>
        <TokenBanner addToast={addToast} />
        <div style={{ flex: 1, overflowY: "auto" }}>
          {page === "dashboard" && <DashboardPage txns={txns} goals={goals} user={user} />}
          {page === "transactions" && <TransactionsPage txns={txns} setTxns={setTxns} user={user} budgets={budgets} addToast={addToast} />}
          {page === "budgets" && <BudgetsPage budgets={budgets} setBudgets={setBudgets} txns={txns} user={user} addToast={addToast} />}
          {page === "goals" && <GoalsPage goals={goals} setGoals={setGoals} user={user} addToast={addToast} />}
          {page === "analytics" && <AnalyticsPage txns={txns} user={user} />}
          {page === "export" && <ExportPage txns={txns} user={user} addToast={addToast} />}
          {page === "admin" && user.role === "admin" && <AdminPage txns={txns} users={users} />}
        </div>
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
