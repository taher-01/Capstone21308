import type { CryEvent } from "@/types";

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPercent(value?: number): string {
  return value === undefined ? "Not provided" : `${Math.round(value * 100)}%`;
}

export function model1Label(e: CryEvent): string {
  return e.model1Prediction === "cry" ? "Cry detected" : "No cry detected";
}

// Returns null when Model 2 does not apply (the sound was not a cry).
export function model2Label(e: CryEvent): string | null {
  if (e.model1Prediction !== "cry") return null;
  if (!e.model2Prediction) return "Not classified";
  if (e.model2Prediction === "uncertain") return "Uncertain classification";
  return e.model2Prediction;
}