export const SEED_USERS = [
  {
    id: "u1",
    name: "Saurabh Nandaniya",
    email: "saurabh@demo.com",
    password: "demo123",
    role: "user",
    createdAt: "2026-01-10",
  },
  { id: "u2", name: "Admin", email: "admin@demo.com", password: "admin123", role: "admin", createdAt: "2026-01-01" },
];

export const SEED_TXN = [
  { id: "t1", userId: "u1", desc: "Grocery run", amount: 850, type: "expense", category: "Food", date: "2026-03-01", notes: "" },
  { id: "t2", userId: "u1", desc: "Metro monthly pass", amount: 400, type: "expense", category: "Transport", date: "2026-03-02", notes: "" },
  { id: "t3", userId: "u1", desc: "Salary", amount: 45000, type: "income", category: "Other", date: "2026-03-01", notes: "March salary" },
  { id: "t4", userId: "u1", desc: "Gym membership", amount: 1200, type: "expense", category: "Health", date: "2026-03-03", notes: "" },
  { id: "t5", userId: "u1", desc: "Netflix", amount: 649, type: "expense", category: "Entertainment", date: "2026-03-04", notes: "" },
  { id: "t6", userId: "u1", desc: "Electricity bill", amount: 1100, type: "expense", category: "Utilities", date: "2026-03-05", notes: "" },
  { id: "t7", userId: "u1", desc: "Online course", amount: 2999, type: "expense", category: "Education", date: "2026-02-15", notes: "Udemy" },
  { id: "t8", userId: "u1", desc: "Freelance project", amount: 12000, type: "income", category: "Other", date: "2026-02-20", notes: "" },
  { id: "t9", userId: "u1", desc: "Restaurant dinner", amount: 1450, type: "expense", category: "Food", date: "2026-02-22", notes: "" },
  { id: "t10", userId: "u1", desc: "Rent", amount: 8000, type: "expense", category: "Housing", date: "2026-02-01", notes: "" },
];

export const SEED_BUDGETS = [
  { id: "b1", userId: "u1", category: "Food", limitAmount: 3000, period: "monthly" },
  { id: "b2", userId: "u1", category: "Entertainment", limitAmount: 1000, period: "monthly" },
  { id: "b3", userId: "u1", category: "Transport", limitAmount: 800, period: "monthly" },
  { id: "b4", userId: "u1", category: "Health", limitAmount: 2000, period: "monthly" },
];

export const SEED_GOALS = [
  { id: "g1", userId: "u1", name: "Emergency Fund", targetAmount: 50000, savedAmount: 18000, deadline: "2026-12-31", status: "active" },
  { id: "g2", userId: "u1", name: "New Laptop", targetAmount: 80000, savedAmount: 35000, deadline: "2026-09-01", status: "active" },
];
