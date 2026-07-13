"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CirclePlus, ReceiptText, Wallet } from "lucide-react";

const ITEMS = [
  { href: "/", label: "Erfassen", icon: CirclePlus },
  { href: "/ausgaben", label: "Ausgaben", icon: ReceiptText },
  { href: "/budget", label: "Budget", icon: Wallet },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line backdrop-blur-md"
      style={{ background: "var(--nav-bg)" }}
    >
      <div className="mx-auto grid max-w-lg grid-cols-3 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                active ? "text-ink" : "text-ink-3"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
