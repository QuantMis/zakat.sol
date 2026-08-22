import { connection } from "next/server";

import { LiveMetrics } from "@/components/marketing/live-metrics";
import { MetricRow, MetricsShell } from "@/components/marketing/metrics-shell";
import { metrics } from "@/data/metrics";
import { currentTotals } from "@/lib/tally";

/**
 * Reads the counters for the first paint. `connection()` because the figures
 * come out of a table and a prerender would bake in whatever they were at build
 * time — the page has to wait for a real request to know them.
 */
export async function MetricsCard() {
  await connection();

  return <LiveMetrics initial={await currentTotals()} />;
}

/**
 * The same card with the figures still to come. Same markup rather than a grey
 * box, so it takes the height the real one will and the hero does not jump.
 */
export function MetricsCardFallback() {
  return (
    <MetricsShell>
      {metrics.map((metric) => (
        <MetricRow
          key={metric.key}
          metric={metric}
          value={<span className="text-brand/25">—</span>}
        />
      ))}
    </MetricsShell>
  );
}
