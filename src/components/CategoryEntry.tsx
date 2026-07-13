"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { CategoryChip } from "./CategoryIcon";
import ExpenseSheet from "./ExpenseSheet";

export default function CategoryEntry({ categories }: { categories: Category[] }) {
  const [selected, setSelected] = useState<Category | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-2 py-4 transition active:scale-95"
          >
            <CategoryChip icon={c.icon} color={c.color} size={48} iconSize={22} />
            <span className="text-[13px] font-medium leading-tight">{c.name}</span>
          </button>
        ))}
      </div>
      {selected && (
        <ExpenseSheet
          key={selected.id}
          categories={categories}
          category={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
