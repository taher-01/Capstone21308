"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { config } from "@/lib/config";
import { getNotifications, getSystemStatus } from "@/lib/api";
import type { ConnectionState } from "@/types";
import { StatusPill } from "@/components/ui/StatusPill";
import { navItems, isActive } from "./nav-items";

export function Header() {
  const pathname = usePathname();
  const title = navItems.find((n) => isActive(pathname, n.href))?.label ?? "BabyCry Alert";
  const isDemo = config.dataMode === "demo";

  const [conn, setConn] = useState<ConnectionState>(isDemo ? "unknown" : "connecting");
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let alive = true;
    async function check() {
      try {
        const s = await getSystemStatus();
        if (alive) setConn(s.backend.state);
      } catch {
        if (alive) setConn("disconnected");
      }
      try {
        const n = await getNotifications();
        if (alive) setUnread(n.filter((x) => !x.read).length);
      } catch {
        /* notifications unavailable: keep the count as is */
      }
    }
    check();
    window.addEventListener("bca-notifications-changed", check);
    const id = isDemo ? undefined : setInterval(check, config.pollIntervalMs);
    return () => {
      alive = false;
      window.removeEventListener("bca-notifications-changed", check);
      if (id) clearInterval(id);
    };
  }, [isDemo]);

  let pill = <StatusPill tone="neutral">No live connection</StatusPill>;
  if (!isDemo) {
    if (conn === "connected") pill = <StatusPill tone="ok">Backend connected</StatusPill>;
    else if (conn === "connecting") pill = <StatusPill tone="warn">Connecting...</StatusPill>;
    else if (conn === "unknown") pill = <StatusPill tone="neutral">Status unknown</StatusPill>;
    else pill = <StatusPill tone="danger">Backend offline</StatusPill>;
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <h1 className="truncate text-lg font-semibold text-brand-900">{title}</h1>
      <div className="flex items-center gap-2 sm:gap-3">
        {isDemo ? <StatusPill tone="warn">Demo data</StatusPill> : <StatusPill tone="ok">Live mode</StatusPill>}
        <span className="hidden sm:inline-flex">{pill}</span>
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-xl border border-line p-2 text-brand-900 transition-colors hover:bg-lavender-100"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}