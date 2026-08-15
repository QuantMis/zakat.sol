"use client";

import { formatUsd } from "@/lib/format";
import { usePortfolio } from "@/state/use-portfolio";

import { rowGrid } from "./grid";

/**
 * The long tail, reported as one line. Unpriced mints and anything under the
 * dust threshold land here and stay out of the total — they are shown so the
 * report accounts for everything the scan saw, not because they are zakatable.
 */
export function DustRow() {
  const { snapshot } = usePortfolio();
  const { dust } = snapshot;

  if (dust.mintCount === 0) return null;

  return (
    <div className={`${rowGrid} px-5 py-3.5 opacity-45`}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-mint text-[10px] font-bold text-muted">
          {dust.mintCount}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14.5px] font-medium">Dust &amp; unpriced tokens</span>
          <span className="text-[11px] text-faint">{dust.mintCount} mints</span>
        </span>
      </div>

      <div className="hidden text-right tabular-nums text-[13.5px] text-ink-soft md:block">—</div>
      <div className="hidden text-right tabular-nums text-[13.5px] text-muted md:block">—</div>
      <div className="text-right tabular-nums text-[14.5px] font-medium">{formatUsd(dust.value)}</div>
    </div>
  );
}
