import type { CryEvent } from "@/types";
import { model1Label, model2Label } from "./format";

function esc(value: string | number | undefined): string {
  const s = value === undefined ? "" : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function downloadEventsCsv(events: CryEvent[], filename: string) {
  const header = [
    "id", "timestamp", "model1_result", "model1_confidence",
    "category", "model2_confidence", "processing_ms", "status", "error",
  ];
  const rows = events.map((e) => [
    e.id, e.timestamp, model1Label(e), e.model1Confidence,
    model2Label(e) ?? "", e.model2Confidence, e.processingTimeMs, e.status, e.errorMessage,
  ]);
  const text = [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}