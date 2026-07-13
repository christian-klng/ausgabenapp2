export default function Meter({
  spent,
  budget,
  height = 8,
}: {
  spent: number;
  budget: number;
  height?: number;
}) {
  const ratio = budget > 0 ? spent / budget : spent > 0 ? 2 : 0;
  const pct = Math.min(ratio, 1) * 100;
  const tone = ratio > 1 ? "danger" : ratio >= 0.85 ? "warn" : "ok";
  const fill =
    tone === "danger" ? "var(--danger)" : tone === "warn" ? "var(--warn)" : "var(--accent)";
  const track =
    tone === "danger"
      ? "var(--danger-soft)"
      : tone === "warn"
        ? "var(--warn-soft)"
        : "var(--accent-soft)";

  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, background: track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${pct}%`, background: fill }}
      />
    </div>
  );
}
