export function formatRupiah(val: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);
}

export function formatShortRupiah(val: number): string {
  if (val >= 1_000_000_000) return "Rp" + (val / 1_000_000_000).toFixed(1).replace(".0", "") + " M";
  if (val >= 1_000_000) return "Rp" + (val / 1_000_000).toFixed(1).replace(".0", "") + " Jt";
  if (val >= 1_000) return "Rp" + Math.round(val / 1_000) + " Rb";
  return formatRupiah(val);
}

export function daysLeft(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function formatDateId(dateStr: string): string {
  return new Date(dateStr + (dateStr.length === 10 ? "T00:00:00" : "")).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}
