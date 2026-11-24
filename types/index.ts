export type Model1Result = "cry" | "not_cry";
export type EventStatus = "processed" | "error" | "processing";
export type ConnectionState = "connected" | "disconnected" | "connecting" | "error" | "unknown";

export interface CryEvent {
  id: string;
  timestamp: string; // ISO 8601, e.g. "2026-11-24T10:15:00Z"
  deviceId?: string;
  model1Prediction: Model1Result;
  model1Confidence?: number; // 0..1, only if the backend provides it
  model2Prediction?: string; // a label from the REAL training dataset, or "uncertain"
  model2Confidence?: number;
  processingTimeMs?: number;
  status: EventStatus;
  modelVersion?: string;
  errorMessage?: string;
}

export interface DashboardData {
  totalEvents: number;
  cryCount: number;
  notCryCount: number;
  uncertainCount: number;
  latestEvent: CryEvent | null;
  recentEvents: CryEvent[];
}

export interface ComponentStatus {
  state: ConnectionState;
  lastSeen?: string;
  detail?: string;
}

export interface SystemStatus {
  pico: ComponentStatus;
  microphone: ComponentStatus;
  model1: ComponentStatus;
  model2: ComponentStatus;
  backend: ComponentStatus & { responseTimeMs?: number };
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  eventId?: string;
}