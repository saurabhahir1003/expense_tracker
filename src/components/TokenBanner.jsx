import { useEffect, useState } from "react";

export default function TokenBanner({ addToast }) {
  const [mins, setMins] = useState(30);

  useEffect(() => {
    const iv = setInterval(() => {
      setMins((m) => {
        if (m <= 1) {
          addToast("warning", "Session Refreshed", "Your session token has been refreshed automatically.");
          return 30;
        }
        return m - 1;
      });
    }, 60000);

    return () => clearInterval(iv);
  }, [addToast]);

  return (
    <div style={{ background: "#F0FDF4", borderBottom: "1px solid #BBF7D0", padding: "6px 20px", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
      <span style={{ fontSize: 11, color: "#64748B" }}>
        Session active · Token refreshes in <strong>{mins}m</strong>
      </span>
    </div>
  );
}
