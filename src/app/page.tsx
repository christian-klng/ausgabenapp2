import Link from "next/link";
import CategoryEntry from "@/components/CategoryEntry";
import Meter from "@/components/Meter";
import PageHeader from "@/components/PageHeader";
import { getCategories, getMonthSummary } from "@/lib/data";
import { currentMonth, formatEuro, formatMonthLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const month = currentMonth();
  const [categories, summary] = await Promise.all([
    getCategories(),
    getMonthSummary(month),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="Ausgabe erfassen" subtitle="Tippe auf eine Kategorie" />

      <Link
        href="/budget"
        className="block rounded-3xl border border-line bg-surface p-4 transition active:scale-[0.99]"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[13px] font-medium text-ink-2">
            {formatMonthLabel(month)}
          </span>
          <span className="text-[13px] text-ink-2 tabular-nums">
            <span className="font-semibold text-ink">
              {formatEuro(summary.spent_cents)}
            </span>{" "}
            / {formatEuro(summary.budget_cents)}
          </span>
        </div>
        <div className="mt-2.5">
          <Meter spent={summary.spent_cents} budget={summary.budget_cents} height={6} />
        </div>
      </Link>

      <CategoryEntry categories={categories} />
    </div>
  );
}
