import { Card } from "@/components/ui/Card";

const steps = [
  "The INMP441 microphone captures audio.",
  "The Raspberry Pi Pico 2 W reads it and sends it over Wi-Fi to the backend.",
  "The backend extracts audio features and runs Model 1 (Cry / Not Cry).",
  "If Model 1 predicts Cry, Model 2 attempts a further classification using only labels from its real training dataset. Low-confidence results are shown as uncertain.",
  "The backend exposes the result through an API, and this dashboard displays it as an event and a notification.",
];

export function AboutView() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">About BabyCry Alert</h2>
        <p className="mt-1 text-sm text-ink-muted">Intelligent infant cry monitoring and audio classification.</p>
      </div>

      <Card title="What it does">
        <p className="text-sm text-ink-muted">
          BabyCry Alert listens for sound through a microphone, uses two machine-learning models to decide whether the audio
          contains an infant cry and, if so, to classify it, and shows the results to a caregiver on this dashboard.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Hardware">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ink-muted">
            <li>Raspberry Pi Pico 2 W (RP2350 microcontroller)</li>
            <li>INMP441 IÂ²S MEMS microphone module</li>
            <li>Breadboard, jumper wires, USB power</li>
          </ul>
          <p className="mt-3 text-xs text-ink-muted">
            The Pico only captures and sends audio. The machine-learning models run on a separate backend, not on the Pico or in the browser.
          </p>
        </Card>

        <Card title="Two-stage AI pipeline">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-muted">
            {steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </Card>
      </div>

      <Card title="Disclaimer">
        <p className="text-sm text-ink-muted">
          BabyCry Alert is an experimental educational prototype. Its AI outputs are predictions based on audio data and must
          not be treated as medical diagnoses or as confirmation of an infant&apos;s needs. It is not a replacement for
          caregiver judgment or professional medical advice.
        </p>
      </Card>
    </div>
  );
}