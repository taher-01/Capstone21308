export type DataMode = "demo" | "live";

export const config = {
  dataMode: (process.env.NEXT_PUBLIC_DATA_MODE === "live" ? "live" : "demo") as DataMode,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  pollIntervalMs: 5000,
};