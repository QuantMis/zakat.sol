"use client";

import { useEffect, useRef, useState } from "react";

import { MetricRow, MetricsShell } from "@/components/marketing/metrics-shell";
import { metrics, type Metric } from "@/data/metrics";
import { formatCompactUsd, formatCount } from "@/lib/format";
import type { MetricTotals } from "@/lib/types";

/**
 * The counters, kept current. The figures arrive server-rendered so the card
 * reads correctly before any JavaScript runs, then an event stream replaces
 * them each time a scan moves one.
 */

/** How long a figure stays highlighted after it moves. */
const FLASH_MS = 1200;

const KEYS = metrics.map((metric) => metric.key);

/** A stable empty set, so settling back to "nothing moved" is not a new render. */
const STILL: ReadonlySet<keyof MetricTotals> = new Set();

function display(totals: MetricTotals, metric: Metric): string {
  const value = totals[metric.key];

  return metric.kind === "usd" ? formatCompactUsd(value) : formatCount(value);
}

export function LiveMetrics({ initial }: { initial: MetricTotals }) {
  const [totals, setTotals] = useState(initial);
  const [moved, setMoved] = useState(STILL);

  // Compared against in an event handler rather than in state, so an update
  // that changes nothing does not schedule a render to find that out.
  const latest = useRef(initial);
  const flash = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const source = new EventSource("/api/metrics/stream");

    source.onmessage = (event) => {
      let next: MetricTotals;

      try {
        next = JSON.parse(event.data) as MetricTotals;
      } catch {
        return;
      }

      const changed = KEYS.filter((key) => latest.current[key] !== next[key]);

      latest.current = next;
      setTotals(next);

      // The stream re-sends the totals on every reconnect, which is usually the
      // same figures the band is already showing.
      if (changed.length === 0) return;

      setMoved(new Set(changed));

      if (flash.current) clearTimeout(flash.current);
      flash.current = setTimeout(() => setMoved(STILL), FLASH_MS);
    };

    // EventSource reconnects on its own, and the reconnect re-sends the totals,
    // so a dropped stream needs nothing here beyond not being noisy about it.
    source.onerror = () => {};

    return () => {
      source.close();
      if (flash.current) clearTimeout(flash.current);
    };
  }, []);

  return (
    <MetricsShell>
      {metrics.map((metric) => (
        <MetricRow
          key={metric.key}
          metric={metric}
          value={display(totals, metric)}
          moved={moved.has(metric.key)}
        />
      ))}
    </MetricsShell>
  );
}
