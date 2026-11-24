import type { SystemStatus } from "@/types";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";

export function MonitoringCard({
  status,
  isDemo,
  lastRefresh,
}: {
  status: SystemStatus | null;
  isDemo: boolean;
  lastRefresh: string | null;
}) {
  const backend = status?.backend;
  const rows: [string, string][] = [
    ["Data source", isDemo ? "Demo data (no hardware or backend)" : "Live backend"],
    [
      "Backend availability",
      isDemo
        ? "Not used in demo mode"
        : backend?.state === "connected"
          ? "Available"
          : backend
            ? "Unavailable"
            : "Unknown",
    ],
    [
      "Latest backend communication",
      backend?.lastSeen ? formatDateTime(backend.lastSeen) : "None recorded",
    ],
    ["Dashboard last refreshed", lastRefresh ? formatDateTime(lastRefresh) : "Not yet"],
  ];

  return (
    <Card title="Monitoring status">
      <dl className="space-y-3 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4">
            <dt className="text-ink-muted">{k}</dt>
            <dd className="text-right font-medium text-brand-900">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}