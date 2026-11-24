"use client";

import { useCallback, useEffect, useState } from "react";
import { Activity, Volume2, VolumeX, CircleHelp } from "lucide-react";
import { config } from "@/lib/config";
import { getDashboardData, getSystemStatus } from "@/lib/api";
import type { DashboardData, SystemStatus } from "@/types";
import { StatusPill } from "@/components/ui/StatusPill";
import { StatCard } from "./StatCard";
import { LatestDetectionCard } from "./LatestDetectionCard";
import { RecentEvents } from "./RecentEvents";
import { PipelineCard } from "./PipelineCard";
import { MonitoringCard } from "./MonitoringCard";

export function Overview() {
  const isDemo = config.dataMode === "demo";
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [today, setToday] = useState("");

  const load = useCallback(async () => {
    const [d, s] = await Promise.allSettled([getDashboardData(), getSystemStatus()]);
    if (d.status === "fulfilled") {
      setData(d.value);
      setError(null);
    } else {
      setData(null);
      setError(d.reason instanceof Error ? d.reason.message : "Could not reach the backend.");
    }
    setStatus(s.status === "fulfilled" ? s.value : null);
    setLastRefresh(new Date().toISOString());
    setToday(new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    if (isDemo) return;
    const id = setInterval(load, config.pollIntervalMs);
    return () => clearInterval(id);
  }, [load, isDemo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">BabyCry Alert</h2>
          <p className="mt-1 text-ink-muted">Intelligent infant cry monitoring and audio classification.</p>
          {today && <p className="mt-1 text-xs text-ink-muted">{today}</p>}
        </div>
        {isDemo ? (
          <StatusPill tone="warn">Demo mode: sample data, no hardware connected</StatusPill>
        ) : error ? (
          <StatusPill tone="danger">Live mode: backend unreachable</StatusPill>
        ) : (
          <StatusPill tone="ok">Live mode</StatusPill>
        )}
      </div>

      {loading && <p className="text-sm text-ink-muted">Loading...</p>}

      {!loading && error && (
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <p className="text-sm font-semibold text-danger">The system is offline or unreachable.</p>
          <p className="mt-1 text-sm text-ink-muted">
            No data is shown because none could be retrieved. Details: {error}
          </p>
        </div>
      )}

      {!loading && data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label={isDemo ? "Total events (demo)" : "Total events"} value={data.totalEvents} icon={Activity} />
            <StatCard label="Cry detections" value={data.cryCount} icon={Volume2} />
            <StatCard label="Non-cry detections" value={data.notCryCount} icon={VolumeX} />
            <StatCard label="Uncertain classifications" value={data.uncertainCount} icon={CircleHelp} />
          </div>

          <div className="grid gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <LatestDetectionCard event={data.latestEvent} isDemo={isDemo} />
            </div>
            <div className="xl:col-span-2">
              <MonitoringCard status={status} isDemo={isDemo} lastRefresh={lastRefresh} />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <RecentEvents events={data.recentEvents} isDemo={isDemo} />
            <PipelineCard status={status} />
          </div>
        </>
      )}

      {!loading && !data && !error && null}
    </div>
  );
}