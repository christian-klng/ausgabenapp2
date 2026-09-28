"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import type { BudgetEntry } from "@/lib/types";
import { updateBudget } from "@/lib/actions";
import { centsToInput, formatEuro, parseAmountToCents } from "@/lib/format";
import { CategoryChip } from "./CategoryIcon";
import Meter from "./Meter";
import Sheet from "./Sheet";
import { useToast } from "./Toast";

function BudgetEditSheet({
  entry,
  onClose,
}: {
  entry: BudgetEntry;
  onClose: () => void;
}) {
  const [value, setValue] = useState(centsToInput(entry.budget_cents));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cents = value.trim() === "" || value.trim() === "0" ? 0 : parseAmountToCents(value);
    if (cents === null) {
      setError("Bitte einen gültigen Betrag eingeben");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateBudget(entry.category_id, cents);
      toast("Budget gespeichert", `${entry.name} ${formatEuro(cents)}`);
      onClose();
    } catch {
      setError("Speichern fehlgeschlagen – bitte nochmal versuchen");
      setSaving(false);
    }
  }

  return (
    <Sheet onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <CategoryChip icon={entry.icon} color={entry.color} size={40} iconSize={18} />
          <div>
            <h2 className="text-lg font-semibold leading-tight">Monatsbudget</h2>
            <p className="text-[13px] text-ink-2">{entry.name}</p>
          </div>
        </div>

        <div className="relative rounded-2xl bg-surface-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="decimal"
            autoFocus
            aria-label="Budget in Euro"
            className="w-full bg-transparent px-10 py-4 text-center text-4xl font-semibold tracking-tight outline-none placeholder:text-ink-3"
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-ink-2">
            €
          </span>
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-ink py-3.5 text-base font-medium text-background transition active:scale-[0.98] disabled:opacity-50"
        >
          {saving ? "Speichern …" : "Speichern"}
        </button>
      </form>
    </Sheet>
  );
}

export default function BudgetList({ entries }: { entries: BudgetEntry[] }) {
  const [editing, setEditing] = useState<BudgetEntry | null>(null);

  return (
    <>
      <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface">
        {entries.map((entry) => {
          const over = entry.remaining_cents < 0;
          return (
            <li key={entry.category_id}>
              <button
                onClick={() => setEditing(entry)}
                className="w-full px-4 py-3.5 text-left transition active:bg-surface-2"
              >
                <div className="flex items-center gap-3">
                  <CategoryChip
                    icon={entry.icon}
                    color={entry.color}
                    size={40}
                    iconSize={18}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[15px] font-medium">
                        {entry.name}
                      </span>
                      <span className="shrink-0 text-[13px] text-ink-2 tabular-nums">
                        <span className="font-semibold text-ink">
                          {formatEuro(entry.spent_cents)}
                        </span>{" "}
                        / {formatEuro(entry.budget_cents)}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Meter
                        spent={entry.spent_cents}
                        budget={entry.budget_cents}
                        height={6}
                      />
                    </div>
                    {over && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-danger">
                        <TriangleAlert size={12} aria-hidden />
                        {formatEuro(-entry.remaining_cents)} über Budget
                      </p>
                    )}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {editing && (
        <BudgetEditSheet
          key={editing.category_id}
          entry={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
