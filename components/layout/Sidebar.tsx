"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby } from "lucide-react";
import { navItems, isActive } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-brand-900 text-white lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Baby size={22} />
        </div>
        <div>
          <p className="text-base font-semibold leading-tight">BabyCry Alert</p>
          <p className="text-xs text-white/60">Experimental prototype</p>
        </div>
      </div>
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(pathname, href) ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <p className="px-6 py-5 text-xs leading-relaxed text-white/50">
        AI outputs are predictions, not medical diagnoses.
      </p>
    </aside>
  );
}