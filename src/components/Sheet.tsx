"use client";

import { useEffect } from "react";

export default function Sheet({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="animate-backdrop absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="animate-sheet absolute inset-x-0 bottom-0 mx-auto max-w-lg rounded-t-3xl bg-surface px-5 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        {children}
      </div>
    </div>
  );
}
