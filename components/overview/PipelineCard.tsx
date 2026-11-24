import { Mic, Wifi, BrainCircuit, Server, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentStatus, SystemStatus } from "@/types";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

type StageKey = "microphone" | "pico" | "model1" | "model2" | "backend" | null;

const stages: { label: string; icon: LucideIcon; key: StageKey }[] = [
  { label: "Microphone audio acquisition", icon: Mic, key: "microphone" },
  { label: "Pico 2 W transmission", icon: Wifi, key: "pico" },
  { label: "Model 1: Cry / Not Cry", icon: BrainCircuit, key: "model1" },
  { label: "Model 2: further cry classification (only if cry)", icon: BrainCircuit, key: "model2" },
  { label: "API communication", icon: Server, key: "backend" },
  { label: "Dashboard notification", icon: Bell, key: null },
];

function pill(s?: ComponentStatus) {
  if (!s) return <StatusPill tone="neutral">Not reported</StatusPill>;
  switch (s.state) {
    case "connected":
      return <StatusPill tone="ok">Active</StatusPill>;
    case "connecting":
      return <StatusPill tone="warn">Connecting</StatusPill>;
    case "disconnected":
      return <StatusPill tone="danger">Offline</StatusPill>;
    case "error":
      return <StatusPill tone="danger">Error</StatusPill>;
    default:
      return <StatusPill tone="neutral">Unknown</StatusPill>;
  }
}

export function PipelineCard({ status }: { status: SystemStatus | null }) {
  return (
    <Card title="AI processing pipeline">
      <ol className="space-y-3">
        {stages.map(({ label, icon: Icon, key }, i) => (
          <li key={label} className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lavender-100 text-brand-600">
              <Icon size={16} />
            </div>
            <p className="flex-1 text-sm text-ink">
              <span className="mr-1 text-ink-muted">{i + 1}.</span>
              {label}
            </p>
            {key ? pill(status?.[key]) : <StatusPill tone="neutral">Not verified</StatusPill>}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-ink-muted">
        The stage layout is an illustration. Each badge shows only what the backend actually reports.
      </p>
    </Card>
  );
}