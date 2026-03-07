import { MONTHS } from "../constants/appConstants";

export const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const fmtDate = (s) => {
  const d = new Date(`${s}T12:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export const uid = () => Math.random().toString(36).slice(2);
export const today = () => new Date().toISOString().split("T")[0];
