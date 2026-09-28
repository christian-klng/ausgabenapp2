"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CircleCheck } from "lucide-react";

type ToastMessage = { id: number; title: string; detail?: string };

const ToastContext = createContext<(title: string, detail?: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

const VISIBLE_MS = 2600;
const EXIT_MS = 200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [leaving, setLeaving] = useState(false);
  const nextId = useRef(0);

  const show = useCallback((title: string, detail?: string) => {
    nextId.current += 1;
    setLeaving(false);
    setToast({ id: nextId.current, title, detail });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const hide = setTimeout(() => setLeaving(true), VISIBLE_MS);
    const remove = setTimeout(() => setToast(null), VISIBLE_MS + EXIT_MS);
    return () => {
      clearTimeout(hide);
      clearTimeout(remove);
    };
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(76px+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4"
      >
        {toast && (
          <div
            key={toast.id}
            role="status"
            className={`flex max-w-full items-center gap-2.5 rounded-full bg-ink py-2.5 pr-5 pl-3.5 text-background shadow-lg ${
              leaving ? "animate-toast-out" : "animate-toast-in"
            }`}
          >
            <CircleCheck size={18} aria-hidden className="shrink-0" />
            <p className="min-w-0 truncate text-sm">
              <span className="font-medium">{toast.title}</span>
              {toast.detail && <span className="opacity-70"> · {toast.detail}</span>}
            </p>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
