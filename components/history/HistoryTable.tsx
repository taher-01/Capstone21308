"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Search } from "lucide-react";
import { config } from "@/lib/config";
import { getEvents } from "@/lib/api";
import type { CryEvent } from "@/types";
import { formatDateTime, formatPercent, model1Label, model2Label } from "@/lib/format";
import { downloadEventsCsv } from "@/lib/csv";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

const PAGE_SIZE = 10;

function localDate(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-600";

export function HistoryTable() {
  const isDemo = config.dataMode === "demo";
  const router = useRouter();

  const [events, setEvents] = useState<CryEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<"all" | "cry" | "not_cry">("all");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const e = await getEvents();
        if (alive) {
          setEvents(e);
          setError(null);
        }
      } catch (err) {
        if (alive) {
          setEvents(null);
          setError(err instanceof Error ? err.message : "Could not reach the backend.");
        }
      }
    }
    load();
    if (isDemo) return () => { alive = false; };
    const id = setInterval(load, config.pollIntervalMs);
    return () => { alive = false; clearInterval(id); };
  }, [isDemo]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    (events ?? []).forEach((e) => {
      const c = model2Label(e);
      if (c) set.add(c);
    });
    return Array.from(set).sort();
  }, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = (events ?? []).filter((e) => {
      if (result !== "all" && e.model1Prediction !== result) return false;
      if (category !== "all" && model2Label(e) !== category) return false;
      if (date && localDate(e.timestamp) !== date) return false;
      if (q) {
        const text = [e.id, model1Label(e), model2Label(e) ?? "", e.status].join(" ").toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
    list.sort((a, b) => {
      const diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      return sort === "newest" ? -diff : diff;
    });
    return list;
  }, [events, search, result, category, date, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function clearFilters() {
    setSearch("");
    setResult("all");
    setCategory("all");
    setDate("");
    setPage(1);
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-danger/30 bg-danger/5 p-5">
        <p className="text-sm font-semibold text-danger">The event history could not be loaded.</p>
        <p className="mt-1 text-sm text-ink-muted">No data is shown because none could be retrieved. Details: {error}</p>
      </div>
    );
  }

  if (events === null) return <p className="text-sm text-ink-muted">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">Event history</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {isDemo ? "Demo data: sample events, not real detections." : "Processed audio events received from the backend."}
          </p>
        </div>
        <button
          onClick={() =>
            downloadEventsCsv(filtered, isDemo ? "demo-babycry-events.csv" : "babycry-events.csv")
          }
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={16} />
          Export CSV ({filtered.length})
        </button>
      </div>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Search ID, result, category..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select
            className={inputClass}
            value={result}
            onChange={(e) => { setResult(e.target.value as "all" | "cry" | "not_cry"); setPage(1); }}
          >
            <option value="all">All results</option>
            <option value="cry">Cry detected</option>
            <option value="not_cry">No cry detected</option>
          </select>
          <select
            className={inputClass}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          >
            <option value="all">All acoustic patterns</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <select
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brand-600"
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          <button onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline">
            Clear filters
          </button>
        </div>
      </Card>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line bg-lavender-50 text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Event ID</th>
              <th className="px-4 py-3 font-medium">Date and time</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Acoustic pattern</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Processing</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {pageItems.map((e) => (
              <tr
                key={e.id}
                onClick={() => router.push(`/history/${encodeURIComponent(e.id)}`)}
                className="cursor-pointer transition-colors hover:bg-lavender-50"
              >
                <td className="px-4 py-3 font-medium text-brand-900">{e.id}</td>
                <td className="px-4 py-3 text-ink-muted">{formatDateTime(e.timestamp)}</td>
                <td className="px-4 py-3">{model1Label(e)}</td>
                <td className="px-4 py-3">{model2Label(e) ?? "Not applicable"}</td>
                <td className="px-4 py-3">{formatPercent(e.model1Confidence)}</td>
                <td className="px-4 py-3">
                  {e.processingTimeMs !== undefined ? `${e.processingTimeMs} ms` : "Not provided"}
                </td>
                <td className="px-4 py-3">
                  <StatusPill tone={e.status === "error" ? "danger" : e.status === "processing" ? "warn" : "ok"}>
                    {e.status === "processed" ? "Processed" : e.status === "processing" ? "Processing" : "Error"}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">
            {events.length === 0 ? "No events have been received yet." : "No events match your filters."}
          </p>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm text-ink-muted">
          <p>
            Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(safePage - 1)}
              disabled={safePage <= 1}
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-brand-900 hover:bg-lavender-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {safePage} of {totalPages}</span>
            <button
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= totalPages}
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-brand-900 hover:bg-lavender-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}