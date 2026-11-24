"use client";

import { config } from "@/lib/config";
import { Card } from "@/components/ui/Card";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="break-all text-right font-medium text-brand-900">{value}</dd>
    </div>
  );
}

export function SettingsView() {
  const isDemo = config.dataMode === "demo";
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Settings</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Read-only for now. Changeable preferences will be added when they have a real effect.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Data source">
          <dl className="divide-y divide-line">
            <Row label="Mode" value={isDemo ? "Demo (sample data)" : "Live (backend API)"} />
            <Row label="API base URL" value={isDemo ? "Not used in demo mode" : config.apiBaseUrl} />
          </dl>
          <p className="mt-3 text-xs text-ink-muted">
            The mode is set in the <code>.env.local</code> file (<code>NEXT_PUBLIC_DATA_MODE</code>) and applies after the
            server is restarted. Never put secrets in settings or in variables starting with NEXT_PUBLIC_.
          </p>
        </Card>

        <Card title="Refresh behavior">
          <dl className="divide-y divide-line">
            <Row
              label="Update method"
              value={isDemo ? "None (static demo data)" : "Polling the backend API"}
            />
            <Row label="Polling interval" value={isDemo ? "Not applicable" : `${config.pollIntervalMs / 1000} seconds`} />
          </dl>
        </Card>

        <Card title="Notifications">
          <dl className="divide-y divide-line">
            <Row label="In-app notifications" value="Available" />
            <Row label="Browser push notifications" value="Not built yet" />
          </dl>
          <p className="mt-3 text-xs text-ink-muted">
            Push notifications need browser permission, a service worker, HTTPS and a backend sender. They come in a later stage.
          </p>
        </Card>

        <Card title="Devices and models">
          <dl className="divide-y divide-line">
            <Row label="Device" value="Raspberry Pi Pico 2 W + INMP441 microphone" />
            <Row label="Model details" value="Shown on the System Status page when the backend reports them" />
          </dl>
        </Card>
      </div>

      <Card title="Experimental prototype">
        <p className="text-sm text-ink-muted">
          BabyCry Alert is an experimental educational prototype. Its AI outputs are predictions based on audio data and must
          not be treated as medical diagnoses or as confirmation of an infant&apos;s needs. It is not a replacement for
          caregiver judgment or professional medical advice.
        </p>
      </Card>
    </div>
  );
}