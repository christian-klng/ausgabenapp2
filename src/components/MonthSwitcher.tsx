import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonthLabel, shiftMonth } from "@/lib/format";

export default function MonthSwitcher({
  month,
  basePath,
}: {
  month: string;
  basePath: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={`${basePath}?monat=${shiftMonth(month, -1)}`}
        className="rounded-full p-2.5 text-ink-2 transition hover:bg-surface-2 active:scale-90"
        aria-label="Vorheriger Monat"
      >
        <ChevronLeft size={22} />
      </Link>
      <h2 className="text-base font-semibold">{formatMonthLabel(month)}</h2>
      <Link
        href={`${basePath}?monat=${shiftMonth(month, 1)}`}
        className="rounded-full p-2.5 text-ink-2 transition hover:bg-surface-2 active:scale-90"
        aria-label="Nächster Monat"
      >
        <ChevronRight size={22} />
      </Link>
    </div>
  );
}
