import { Volume2, VolumeX } from "lucide-react";
import type { CryEvent } from "@/types";
import { formatDateTime, formatPercent, model1Label, model2Label } from "@/lib/format";
import { StatusPill } from "@/components/ui/StatusPill";

export function LatestDetectionCard({ event, isDemo }: { event: CryEvent | null; isDemo: boolean }) {
  if (!event) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-brand-900">Latest detection</h2>
        <p className="mt-3 text-sm text-ink-muted">No events have been received yet.</p>
      </div>
    );
  }

  const isCry = event.model1Prediction === "cry";
  const category = model2Label(event);

  return (
    <div
      className={`rounded-2xl p-6 shadow-sm ${
        isCry ? "bg-brand-900 text-white" : "border border-line bg-white text-ink"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-semibold ${isCry ? "text-white/70" : "text-brand-900"}`}>
          Latest detection {isDemo && "(demo data)"}
        </p>
        <StatusPill tone={event.status === "error" ? "danger" : event.status === "processing" ? "warn" : "ok"}>
          {event.status === "processed" ? "Processed" : event.status === "processing" ? "Processing" : "Error"}
        </StatusPill>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className={`rounded-2xl p-3 ${isCry ? "bg-white/10" : "bg-lavender-100 text-brand-600"}`}>
          {isCry ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </div>
        <div>
          <p className="text-2xl font-semibold">{model1Label(event)}</p>
          <p className={`text-sm ${isCry ? "text-white/70" : "text-ink-muted"}`}>{formatDateTime(event.timestamp)}</p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className={isCry ? "text-white/60" : "text-ink-muted"}>Acoustic pattern</dt>
          <dd className="font-medium">{category ?? "Not applicable"}</dd>
        </div>
        <div>
          <dt className={isCry ? "text-white/60" : "text-ink-muted"}>Model 1 confidence</dt>
          <dd className="font-medium">{formatPercent(event.model1Confidence)}</dd>
        </div>
        <div>
          <dt className={isCry ? "text-white/60" : "text-ink-muted"}>Processing time</dt>
          <dd className="font-medium">
            {event.processingTimeMs !== undefined ? `${event.processingTimeMs} ms` : "Not provided"}
          </dd>
        </div>
      </dl>

      <p className={`mt-5 text-xs ${isCry ? "text-white/50" : "text-ink-muted"}`}>
        Experimental prediction. The acoustic pattern is a sound group from the training dataset, not a reason for crying or a diagnosis.
      </p>
    </div>
  );
}