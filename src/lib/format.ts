const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const BERLIN = "Europe/Berlin";

export function formatEuro(cents: number): string {
  return EUR.format(cents / 100);
}

/** "12,34" | "1.234,56" | "12.34" → Cents; null bei ungültiger Eingabe */
export function parseAmountToCents(raw: string): number | null {
  let s = raw.trim().replace(/\s/g, "").replace("€", "");
  if (!s) return null;
  if (s.includes(",")) {
    s = s.replace(/\./g, "").replace(",", ".");
  }
  const value = Number(s);
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value * 100);
}

export function centsToInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

/** Heutiges Datum in Europe/Berlin als YYYY-MM-DD */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BERLIN }).format(new Date());
}

export function currentMonth(): string {
  return todayISO().slice(0, 7);
}

export function isMonth(s: string | undefined): s is string {
  return !!s && /^\d{4}-(0[1-9]|1[0-2])$/.test(s);
}

export function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, 1)));
}

export function formatDayHeading(date: string): string {
  const today = todayISO();
  if (date === today) return "Heute";

  const t = new Date(`${today}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() - 1);
  if (date === t.toISOString().slice(0, 10)) return "Gestern";

  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  };
  if (date.slice(0, 4) !== today.slice(0, 4)) opts.year = "numeric";
  return new Intl.DateTimeFormat("de-DE", opts).format(new Date(`${date}T00:00:00Z`));
}
