"use client";

import { useState } from "react";
import type { Category, Expense } from "@/lib/types";
import { createExpense, deleteExpense, updateExpense } from "@/lib/actions";
import { centsToInput, parseAmountToCents, todayISO } from "@/lib/format";
import { CategoryChip } from "./CategoryIcon";
import Sheet from "./Sheet";

export default function ExpenseSheet({
  categories,
  category,
  expense,
  onClose,
}: {
  categories: Category[];
  category: Category;
  expense?: Expense;
  onClose: () => void;
}) {
  const [categoryId, setCategoryId] = useState(expense?.category_id ?? category.id);
  const [amount, setAmount] = useState(
    expense ? centsToInput(expense.amount_cents) : ""
  );
  const [description, setDescription] = useState(expense?.description ?? "");
  const [date, setDate] = useState(expense?.spent_at ?? todayISO());
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = categories.find((c) => c.id === categoryId) ?? category;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cents = parseAmountToCents(amount);
    if (!cents) {
      setError("Bitte einen gültigen Betrag eingeben");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const input = {
        category_id: categoryId,
        amount_cents: cents,
        description: description.trim() || null,
        spent_at: date,
      };
      if (expense) {
        await updateExpense(expense.id, input);
      } else {
        await createExpense(input);
      }
      onClose();
    } catch {
      setError("Speichern fehlgeschlagen – bitte nochmal versuchen");
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!expense) return;
    setSaving(true);
    try {
      await deleteExpense(expense.id);
      onClose();
    } catch {
      setError("Löschen fehlgeschlagen – bitte nochmal versuchen");
      setSaving(false);
    }
  }

  return (
    <Sheet onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-3">
          <CategoryChip icon={selected.icon} color={selected.color} size={40} iconSize={18} />
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {expense ? "Ausgabe bearbeiten" : "Neue Ausgabe"}
            </h2>
            <p className="text-[13px] text-ink-2">{selected.name}</p>
          </div>
        </div>

        <div className="-mx-5 overflow-x-auto px-5" role="radiogroup" aria-label="Kategorie">
          <div className="flex w-max gap-2">
            {categories.map((c) => {
              const active = c.id === categoryId;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCategoryId(c.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition ${
                    active
                      ? "border-ink bg-ink text-background"
                      : "border-line bg-surface text-ink-2"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-2xl bg-surface-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0,00"
            autoFocus={!expense}
            aria-label="Betrag in Euro"
            className="w-full bg-transparent px-10 py-4 text-center text-4xl font-semibold tracking-tight outline-none placeholder:text-ink-3"
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-ink-2">
            €
          </span>
        </div>

        <div className="space-y-3">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung (optional)"
            aria-label="Beschreibung"
            className="w-full rounded-xl bg-surface-2 px-4 py-3 text-base outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-accent"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            aria-label="Datum"
            className="w-full rounded-xl bg-surface-2 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        {error && <p className="text-sm font-medium text-danger">{error}</p>}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-ink py-3.5 text-base font-medium text-background transition active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Speichern …" : "Speichern"}
          </button>
          {expense &&
            (confirmDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="w-full rounded-full bg-danger-soft py-3 text-base font-medium text-danger disabled:opacity-50"
              >
                Wirklich löschen?
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full rounded-full py-3 text-base font-medium text-danger"
              >
                Löschen
              </button>
            ))}
        </div>
      </form>
    </Sheet>
  );
}
