import type { ReactNode } from "react";

import { MetricMark } from "@/components/marketing/metric-mark";
import type { Metric } from "@/data/metrics";
import { cn } from "@/lib/cn";

/**
 * The card that sits beside the hero form: what the calculator has counted so
 * far, three figures deep. Shared by the live card and the one standing in
 * while the totals are still being read, so the two cannot drift apart and the
 * swap costs the page no height.
 */
export function MetricsShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_24px_60px_rgba(20,37,28,0.08)]">
      <div className="flex items-center justify-between gap-4 border-b border-line-soft px-5 py-4">
        <span className="text-[14.5px] font-semibold">Running total</span>
        {/* Not a control — it says the figures below arrive as scans land. */}
        <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] tracking-[0.12em] text-brand-deep uppercase">
          Live
        </span>
      </div>

      <dl className="flex flex-col">{children}</dl>
    </div>
  );
}

type MetricRowProps = {
  metric: Metric;
  /** A node rather than a string so a figure still to arrive can be greyed. */
  value: ReactNode;
  /** Whether this figure has just moved, which tints the row until it settles. */
  moved?: boolean;
};

export function MetricRow({ metric, value, moved = false }: MetricRowProps) {
  return (
    // The rows go edge to edge so a tinted one reads as a full band rather than
    // a floating chip, which is why the card clips instead of padding.
    <div
      className={cn(
        "flex items-center gap-3.5 px-5 py-3.5 transition-colors duration-500 not-last:border-b not-last:border-line-soft motion-reduce:transition-none",
        moved && "bg-mint/70",
      )}
    >
      <MetricMark metric={metric} />
      <dt className="min-w-0 flex-1 text-[14.5px] text-ink-soft">{metric.label}</dt>
      <dd className="text-[20px] font-semibold tracking-[-0.02em] text-brand tabular-nums">
        {value}
      </dd>
    </div>
  );
}
