"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function apply(v: string) {
    setValue(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = v.trim();
      router.replace(q ? `/ausgaben?q=${encodeURIComponent(q)}` : "/ausgaben", {
        scroll: false,
      });
    }, 250);
  }

  return (
    <div className="relative">
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3"
        aria-hidden
      />
      <input
        value={value}
        onChange={(e) => apply(e.target.value)}
        placeholder="Suchen …"
        aria-label="Ausgaben durchsuchen"
        className="w-full rounded-full border border-line bg-surface py-3 pr-11 pl-11 text-base outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-accent"
      />
      {value && (
        <button
          onClick={() => apply("")}
          aria-label="Suche löschen"
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-ink-3 hover:bg-surface-2"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
