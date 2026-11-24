"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { config } from "@/lib/config";
import { getEventById } from "@/lib/api";
import type { CryEvent } from "@/types";
import { formatDateTime, formatPercent, model1Label, model2Label } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-brand-900">{value}</dd>
    </div>
  );
}

export function EventDetail() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(String(params.id));
  const isDemo = config.dataMode === "demo";

  const [event, setEvent] = useState<CryEvent | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getEventById(id)
      .then((e) => { if (alive) { setEvent(e); setError(null); } })
      .catch((err) => { if (alive) setError(err instanceof Error ? err.message : "Could not reach the backend."); });
    return () => { alive = false; };
  }, [id]);

  const back = (
    <Link href="/history" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
      <ArrowLeft size={16} /> Back to event history
    </Link>
  );

  if (error) {
    return (
      <div className="space-y-4">
        {back}
        <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
          <p className="text-sm font-semibold text-danger">This event could not be loaded.</p>
          <p className="mt-1 text-sm text-ink-muted">Details: {error}</p>
        </div>
      </div>
    );
  }

  if (event === undefined) return <p className="text-sm text-ink-muted">Loading...</p>;

  if (event === null) {
    return (
      <div className="space-y-4">
        {back}
        <Card>
          <p className="text-sm text-ink-muted">No event with the ID "{id}" was found.</p>
        </Card>
      </div>
    );
  }

  const isCry = event.model1Prediction === "cry";
  const category = model2Label(event);

  return (
    <div className="space-y-4">
      {back}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">Event {event.id}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {formatDateTime(event.timestamp)} {isDemo && "(demo data)"}
          </p>
        </div>
        <StatusPill tone={event.status === "error" ? "danger" : event.status === "processing" ? "warn" : "ok"}>
          {event.status === "processed" ? "Processed" : event.status === "processing" ? "Processing" : "Error"}
        </StatusPill>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Model 1: Cry / Not Cry">
          <dl className="divide-y divide-line">
            <Row label="Result" value={model1Label(event)} />
            <Row label="Confidence" value={formatPercent(event.model1Confidence)} />
          </dl>
        </Card>

        <Card title="Model 2: further cry classification">
          {isCry ? (
            <dl className="divide-y divide-line">
              <Row label="Acoustic pattern" value={category ?? "Not classified"} />
              <Row label="Confidence" value={formatPercent(event.model2Confidence)} />
            </dl>
          ) : (
            <p className="text-sm text-ink-muted">Model 2 was not used because no cry was detected.</p>
          )}
          {event.model2Prediction === "uncertain" && (
            <p className="mt-3 rounded-xl bg-warn/10 p-3 text-xs text-warn">
              The model was not confident enough to assign a category.
            </p>
          )}
        </Card>

        <Card title="Processing">
          <dl className="divide-y divide-line">
            <Row
              label="Processing time"
              value={event.processingTimeMs !== undefined ? `${event.processingTimeMs} ms` : "Not provided"}
            />
            <Row label="Device" value={event.deviceId ?? "Not provided"} />
            <Row label="Model version" value={event.modelVersion ?? "Not provided"} />
          </dl>
          {event.errorMessage && (
            <p className="mt-3 rounded-xl bg-danger/10 p-3 text-xs text-danger">{event.errorMessage}</p>
          )}
        </Card>
      </div>

      <p className="text-xs text-ink-muted">
        Experimental prediction based on audio data. The acoustic pattern is a sound group from the training dataset, not a reason for crying or a diagnosis.
      </p>
    </div>
  );
}