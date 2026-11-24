"use client";

import { useCallback, useEffect, useState } from "react";
import { Mic, Wifi, BrainCircuit, Server } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { config } from "@/lib/config";
import { getSystemStatus } from "@/lib/api";
import type { ComponentStatus, SystemStatus } from "@/types";
import { formatDateTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

function statePill(s?: ComponentStatus) {
  switch (s?.state) {
    case "connected":
      return <StatusPill tone="ok">Connected</StatusPill>;
    case "connecting":
      return <StatusPill tone="warn">Connecting</StatusPill>;
    case "disconnected":
      return <StatusPill tone="danger">Disconnected</StatusPill>;
    case "error":
      return <StatusPill tone="danger">Error</StatusPill>;
    default:
      return <StatusPill tone="neutral">Unknown</StatusPill>;
  }
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-brand-900">{value}</dd>
    </div>
  );
}

function StatusCard({
  title,
  icon: Icon,
  status,
  extra,
}: {
  title: string;
  icon: LucideIcon;
  status?: ComponentStatus;
  extra?: [string, string][];
}) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-lavender-100 p-2 text-brand-600">
            <Icon size={16} />
          </div>
          <h3 className="text-sm font-semibold text-brand-900">{title}</h3>
        </div>
        {statePill(status)}
      </div>
      <dl className="divide-y divide-line">
        <Row label="Last communication" value={status?.lastSeen ? formatDateTime(status.lastSeen) : "None recorded"} />
        <Row label="Details" value={status?.detail ?? "Not reported"} />
        {extra?.map(([k, v]) => <Row key={k} label={k} value={v} />)}
      </dl>
    </Card>
  );
}

export function SystemStatusView() {
  const isDemo = config.dataMode === "demo";
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setStatus(await getSystemStatus());
      setError(null);
    } catch (err) {
      setStatus(null);
      setError(err instanceof Error ? err.message : "Could not reach the backend.");
    }
    setLastRefresh(new Date().toISOString());
  }, []);

  useEffect(() => {
    load();
    if (isDemo) return;
    const id = setInterval(load, config.pollIntervalMs);
    return () => clearInterval(id);
  }, [load, isDemo]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">System status</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Every status below comes from a backend response. Anything the backend does not report shows as unknown.
          </p>
        </div>
        {isDemo && <StatusPill tone="warn">Demo mode: no hardware or backend in use</StatusPill>}
      </div>

      {error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <p className="text-sm font-semibold text-danger">The backend is unreachable, so no status can be shown.</p>
          <p className="mt-1 text-sm text-ink-muted">Details: {error}</p>
        </div>
      )}

      {!error && !status && <p className="text-sm text-ink-muted">Loading...</p>}

      {status && (
        <div className="grid gap-4 lg:grid-cols-2">
          <StatusCard title="Hardware: Raspberry Pi Pico 2 W" icon={Wifi} status={status.pico} />
          <StatusCard title="Microphone / audio acquisition" icon={Mic} status={status.microphone} />
          <StatusCard title="Model 1: Cry / Not Cry" icon={BrainCircuit} status={status.model1} />
          <StatusCard title="Model 2: further cry classification" icon={BrainCircuit} status={status.model2} />
          <StatusCard
            title="Backend API"
            icon={Server}
            status={status.backend}
            extra={[
              [
                "Response time",
                status.backend.responseTimeMs !== undefined ? `${status.backend.responseTimeMs} ms` : "Not measured",
              ],
            ]}
          />
        </div>
      )}

      <p className="text-xs text-ink-muted">
        Dashboard last checked: {lastRefresh ? formatDateTime(lastRefresh) : "not yet"}
      </p>
    </div>
  );
}