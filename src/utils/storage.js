export const STORAGE_KEYS = {
  user: "expensetrack_user",
  users: "expensetrack_users",
  txns: "expensetrack_txns",
  budgets: "expensetrack_budgets",
  goals: "expensetrack_goals",
};

export function readStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors (e.g. quota exceeded/private mode restrictions)
  }
}

export function removeStored(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore remove errors
  }
}
