import { config } from "./config";
import { demoEvents, demoNotifications, demoSystemStatus } from "./demo-data";
import type { AppNotification, CryEvent, DashboardData, SystemStatus } from "@/types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, init);
  if (!res.ok) throw new Error(`Backend returned ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

const isDemo = () => config.dataMode === "demo";

// Demo mode only: read state lives in memory and resets when the page reloads.
const demoRead = new Set<string>();

export async function getEvents(): Promise<CryEvent[]> {
  if (isDemo()) return demoEvents;
  return request<CryEvent[]>("/api/events");
}

export async function getEventById(id: string): Promise<CryEvent | null> {
  if (isDemo()) return demoEvents.find((e) => e.id === id) ?? null;
  return request<CryEvent>(`/api/events/${encodeURIComponent(id)}`);
}

export async function getDashboardData(): Promise<DashboardData> {
  if (isDemo()) {
    return {
      totalEvents: demoEvents.length,
      cryCount: demoEvents.filter((e) => e.model1Prediction === "cry").length,
      notCryCount: demoEvents.filter((e) => e.model1Prediction === "not_cry").length,
      uncertainCount: demoEvents.filter((e) => e.model2Prediction === "uncertain").length,
      latestEvent: demoEvents[0] ?? null,
      recentEvents: demoEvents.slice(0, 5),
    };
  }
  return request<DashboardData>("/api/dashboard");
}

export async function getSystemStatus(): Promise<SystemStatus> {
  if (isDemo()) return demoSystemStatus;
  return request<SystemStatus>("/api/system/status");
}

export async function getNotifications(): Promise<AppNotification[]> {
  if (isDemo()) return demoNotifications.map((n) => ({ ...n, read: n.read || demoRead.has(n.id) }));
  return request<AppNotification[]>("/api/notifications");
}

export async function markNotificationAsRead(id: string): Promise<void> {
  if (isDemo()) {
    demoRead.add(id);
    return;
  }
  await request(`/api/notifications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ read: true }),
  });
}

// Uses the single-notification endpoint for each unread item, so no extra endpoint is needed.
export async function markAllNotificationsAsRead(): Promise<void> {
  const list = await getNotifications();
  await Promise.all(list.filter((n) => !n.read).map((n) => markNotificationAsRead(n.id)));
}