"use client";

import { useMemo, useState } from "react";
import type { Category, Expense } from "@/lib/types";
import { formatDayHeading, formatEuro } from "@/lib/format";
import { CategoryChip } from "./CategoryIcon";
import ExpenseSheet from "./ExpenseSheet";

export default function ExpenseList({
  expenses,
  categories,
  searchTerm,
}: {
  expenses: Expense[];
  categories: Category[];
  searchTerm?: string;
}) {
  const [editing, setEditing] = useState<Expense | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const e of expenses) {
      const list = map.get(e.spent_at);
      if (list) {
        list.push(e);
      } else {
        map.set(e.spent_at, [e]);
      }
    }
    return [...map.entries()];
  }, [expenses]);

  const editingCategory = editing
    ? categories.find((c) => c.id === editing.category_id)
    : null;

  if (expenses.length === 0) {
    return (
      <p className="rounded-3xl border border-line bg-surface px-4 py-10 text-center text-sm text-ink-2">
        {searchTerm
          ? `Keine Ausgaben für „${searchTerm}“ gefunden`
          : "Noch keine Ausgaben erfasst"}
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map(([date, items]) => {
        const dayTotal = items.reduce((sum, e) => sum + e.amount_cents, 0);
        return (
          <section key={date}>
            <div className="flex items-baseline justify-between px-1 pb-2">
              <h3 className="text-[13px] font-semibold text-ink-2">
                {formatDayHeading(date)}
              </h3>
              <span className="text-[13px] text-ink-3 tabular-nums">
                {formatEuro(dayTotal)}
              </span>
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
              {items.map((e) => (
                <li key={e.id}>
                  <button
                    onClick={() => setEditing(e)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-surface-2"
                  >
                    <CategoryChip icon={e.icon} color={e.color} size={40} iconSize={18} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">
                        {e.description || e.category_name}
                      </p>
                      {e.description && (
                        <p className="text-xs text-ink-3">{e.category_name}</p>
                      )}
                    </div>
                    <span className="shrink-0 text-[15px] font-medium tabular-nums">
                      {formatEuro(e.amount_cents)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {editing && editingCategory && (
        <ExpenseSheet
          key={editing.id}
          categories={categories}
          category={editingCategory}
          expense={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
