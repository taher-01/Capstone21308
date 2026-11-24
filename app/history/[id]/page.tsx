import { Suspense } from "react";
import { EventDetail } from "@/components/history/EventDetail";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-sm text-ink-muted">Loading...</p>}>
      <EventDetail />
    </Suspense>
  );
}