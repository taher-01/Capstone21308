"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCheck } from "lucide-react";
import { config } from "@/lib/config";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/api";
import type { AppNotification } from "@/types";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";

function announceChange() {
  window.dispatchEvent(new Event("bca-notifications-changed"));
}

export function NotificationList() {
  const isDemo = config.dataMode === "demo";
  const [items, setItems] = useState<AppNotification[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const list = await getNotifications();
      setItems([...list].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      setError(null);
    } catch (err) {
      setItems(null);
      setError(err instanceof Error ? err.message : "Could not reach the backend.");
    }
  }, []);

  useEffect(() => {
    load();
    if (isDemo) return;
    const id = setInterval(load, config.pollIntervalMs);
    return () => clearInterval(id);
  }, [load, isDemo]);

  async function markOne(id: string) {
    try {
      await markNotificationAsRead(id);
      setActionError(null);
      await load();
      announceChange();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the notification.");
    }
  }

  async function markAll() {
    try {
      await markAllNotificationsAsRead();
      setActionError(null);
      await load();
      announceChange();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the notifications.");
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
        <p className="text-sm font-semibold text-danger">Notifications could not be loaded.</p>
        <p className="mt-1 text-sm text-ink-muted">No data is shown because none could be retrieved. Details: {error}</p>
      </div>
    );
  }

  if (items === null) return <p className="text-sm text-ink-muted">Loading...</p>;

  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">Notifications</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {isDemo
              ? "Demo data: sample notifications. Read state resets when you reload the page."
              : "In-app notifications generated from backend events."}
          </p>
        </div>
        <button
          onClick={markAll}
          disabled={unread === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      {actionError && (
        <p className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm text-danger">{actionError}</p>
      )}

      <Card>
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">No notifications yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {items.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-4">
                <span
                  className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.read ? "bg-line" : "bg-brand-600"}`}
                  aria-label={n.read ? "Read" : "Unread"}
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${n.read ? "font-medium text-ink" : "font-semibold text-brand-900"}`}>
                    {n.title}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-muted">{n.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                    <span>{formatDateTime(n.timestamp)}</span>
                    {n.eventId && (
                      <Link href={`/history/${encodeURIComponent(n.eventId)}`} className="font-medium text-brand-600 hover:underline">
                        View event
                      </Link>
                    )}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markOne(n.id)}
                    className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-xs font-medium text-brand-900 hover:bg-lavender-100"
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-ink-muted">
        These are in-app notifications. Browser push notifications are a separate feature that has not been built yet.
      </p>
    </div>
  );
}