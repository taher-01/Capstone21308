"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, isActive } from "./nav-items";

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-white lg:hidden">
      {navItems.map(({ href, short, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
              active ? "text-brand-900" : "text-ink-muted"
            }`}
          >
            <Icon size={20} />
            {short}
          </Link>
        );
      })}
    </nav>
  );
}