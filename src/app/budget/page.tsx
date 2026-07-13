import BudgetList from "@/components/BudgetList";
import Meter from "@/components/Meter";
import MonthSwitcher from "@/components/MonthSwitcher";
import { getBudgets } from "@/lib/data";
import { currentMonth, formatEuro, isMonth } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function BudgetPage({
  searchParams,
}: {
  searchParams: Promise<{ monat?: string }>;
}) {
  const params = await searchParams;
  const month = isMonth(params.monat) ? params.monat : currentMonth();
  const entries = await getBudgets(month);

  const spent = entries.reduce((sum, e) => sum + e.spent_cents, 0);
  const budget = entries.reduce((sum, e) => sum + e.budget_cents, 0);
  const remaining = budget - spent;

  return (
    <div className="space-y-5">
      <MonthSwitcher month={month} basePath="/budget" />

      <section className="rounded-3xl border border-line bg-surface p-6 text-center">
        <p className="text-[13px] font-medium text-ink-2">Ausgegeben</p>
        <p className="mt-1 text-5xl font-semibold tracking-tight">
          {formatEuro(spent)}
        </p>
        <p className="mt-2 text-sm text-ink-2">
          {remaining >= 0
            ? `${formatEuro(remaining)} übrig von ${formatEuro(budget)}`
            : `${formatEuro(-remaining)} über dem Budget von ${formatEuro(budget)}`}
        </p>
        <div className="mt-5">
          <Meter spent={spent} budget={budget} />
        </div>
      </section>

      <BudgetList entries={entries} />
    </div>
  );
}
