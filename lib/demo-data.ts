import type { CryEvent, AppNotification, SystemStatus } from "@/types";

// DEMO ONLY. Sample events, not real detections. "neh" and "owh" are pattern names from the dataset.
// The final label list is confirmed when the backend model is verified.
const base = Date.parse("2026-11-24T10:15:00Z");

export const demoEvents: CryEvent[] = Array.from({ length: 24 }, (_, i) => {
  const isCry = i % 3 !== 1;
  const event: CryEvent = {
    id: `demo-${String(i + 1).padStart(3, "0")}`,
    timestamp: new Date(base - i * 17 * 60 * 1000).toISOString(),
    model1Prediction: isCry ? "cry" : "not_cry",
    model1Confidence: Math.round((0.78 + ((i * 7) % 20) / 100) * 100) / 100,
    processingTimeMs: 110 + ((i * 37) % 120),
    status: "processed",
  };
  if (isCry) {
    if (i % 5 === 3) {
      event.model2Prediction = "uncertain";
      event.model2Confidence = 0.42;
    } else {
      event.model2Prediction = i % 2 === 0 ? "neh" : "owh";
      event.model2Confidence = Math.round((0.55 + ((i * 11) % 30) / 100) * 100) / 100;
    }
  }
  if (i === 9) {
    event.status = "error";
    event.errorMessage = "Demo error: audio chunk too short to process.";
  }
  return event;
});

export const demoNotifications: AppNotification[] = [
  { id: "demo-n1", title: "Cry detected (demo)", description: "Sample notification linked to a sample event.", timestamp: "2026-11-24T10:15:00Z", read: false, eventId: "demo-001" },
  { id: "demo-n2", title: "Classification completed (demo)", description: "Sample notification: an uncertain classification.", timestamp: "2026-11-24T09:41:00Z", read: false, eventId: "demo-004" },
  { id: "demo-n3", title: "Audio processing error (demo)", description: "Sample notification: an audio chunk was too short.", timestamp: "2026-11-24T07:25:00Z", read: true, eventId: "demo-010" },
  { id: "demo-n4", title: "Backend reconnected (demo)", description: "Sample system notification with no linked event.", timestamp: "2026-11-24T06:00:00Z", read: true },
];

export const demoSystemStatus: SystemStatus = {
  pico: { state: "unknown", detail: "Demo mode: no hardware connected" },
  microphone: { state: "unknown" },
  model1: { state: "unknown" },
  model2: { state: "unknown" },
  backend: { state: "unknown", detail: "Demo mode: no backend in use" },
};