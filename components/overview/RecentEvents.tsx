import Link from "next/link";
import type { CryEvent } from "@/types";
import { formatDateTime, formatPercent, model1Label, model2Label } from "@/lib/format";
import { Card } from "@/components/ui/Card";

export function RecentEvents({ events, isDemo }: { events: CryEvent[]; isDemo: boolean }) {
  return (
    <Card
      title={isDemo ? "Recent events (demo data)" : "Recent events"}
      action={
        <Link href="/history" className="text-xs font-medium text-brand-600 hover:underline">
          View all
        </Link>
      }
    >
      {events.length === 0 ? (
        <p className="py-6 text-center text-sm text-ink-muted">No events yet.</p>
      ) : (
        <ul className="divide-y divide-line">
          {events.map((e) => (
            <li key={e.id}>
              <Link
                href={`/history/${encodeURIComponent(e.id)}`}
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-lavender-50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-brand-900">
                    {model1Label(e)}
                    {model2Label(e) && <span className="font-normal text-ink-muted"> · {model2Label(e)}</span>}
                  </p>
                  <p className="text-xs text-ink-muted">{formatDateTime(e.timestamp)}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-ink-muted">
                  <p>{formatPercent(e.model1Confidence)}</p>
                  <p className="capitalize">{e.status}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}