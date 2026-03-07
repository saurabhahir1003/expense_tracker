import { useState } from "react";
import { ACCENT, PRIMARY } from "../constants/appConstants";
import { today, uid } from "../utils/formatters";
import FormField from "../components/ui/FormField";
import { inputStyle } from "../components/ui/formStyles";

export default function AuthPage({ onLogin, users }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "saurabh@demo.com", password: "demo123" });
  const [err, setErr] = useState("");

  const handle = () => {
    setErr("");

    if (mode === "login") {
      const user = users.find((u) => u.email === form.email && u.password === form.password);
      if (!user) return setErr("Invalid email or password.");
      onLogin(user, users);
      return;
    }

    if (!form.name || !form.email || !form.password) return setErr("All fields required.");
    if (users.find((u) => u.email === form.email)) return setErr("Email already registered.");

    const newUser = {
      id: uid(),
      name: form.name,
      email: form.email,
      password: form.password,
      role: "user",
      createdAt: today(),
    };

    const newUsers = [...users, newUser];
    onLogin(newUser, newUsers);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F766E 0%, #134E4A 60%, #0C1A1A 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(20,184,166,.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,.15) 0%, transparent 50%)",
        }}
      />
      <div className="pop" style={{ background: "rgba(255,255,255,.97)", borderRadius: 24, padding: 40, width: "90%", maxWidth: 420, boxShadow: "0 32px 80px rgba(0,0,0,.25)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
          <h1 style={{ fontWeight: 700, fontSize: 26, color: PRIMARY, letterSpacing: -1 }}>Expensetrack</h1>
          <p style={{ color: "#94A3B8", fontSize: 13, marginTop: 4 }}>Smart financial management</p>
        </div>

        <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="btn-hover"
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 13,
                border: "none",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? PRIMARY : "#94A3B8",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,.08)" : "none",
              }}
            >
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {mode === "signup" && (
          <FormField label="Full Name">
            <input style={inputStyle} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Your name" />
          </FormField>
        )}

        <FormField label="Email">
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
        </FormField>

        <FormField label="Password">
          <input
            style={inputStyle}
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </FormField>

        {err && <div style={{ color: "#EF4444", fontSize: 12, marginBottom: 12, background: "#FEF2F2", padding: "8px 12px", borderRadius: 8 }}>⚠️ {err}</div>}

        <button className="btn-hover" onClick={handle} style={{ width: "100%", padding: "12px 0", background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, color: "#fff", borderRadius: 12, fontWeight: 700, fontSize: 15, border: "none", boxShadow: "0 4px 16px rgba(15,118,110,.35)" }}>
          {mode === "login" ? "Sign In →" : "Create Account →"}
        </button>

        <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 16 }}>
          Demo: <span style={{ color: PRIMARY, fontWeight: 600 }}>saurabh@demo.com / demo123</span>
        </p>
      </div>
    </div>
  );
}
