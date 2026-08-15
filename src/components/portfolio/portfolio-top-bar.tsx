"use client";

import { portfolio, solPrice } from "@/data/portfolio";
import { formatDate, formatTime, formatUsd } from "@/lib/format";
import { useZakatSettings } from "@/state/zakat-settings";

export function PortfolioTopBar() {
  const { settings } = useZakatSettings();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-5 py-4 lg:h-16 lg:flex-nowrap lg:px-8 lg:py-0">
      <div className="flex items-center gap-3">
        <h1 className="text-base">Portfolio</h1>
        <span className="rounded-md bg-brand/10 px-2.5 py-1 font-mono text-[11px] text-brand">
          SCANNED {formatTime(portfolio.scannedAt)}
        </span>
      </div>

      <div className="flex items-center gap-2.5 font-mono text-xs text-muted-soft">
        <span>SOL {formatUsd(solPrice)}</span>
        <span className="h-3.5 w-px bg-line" aria-hidden />
        <span>{formatDate(portfolio.scannedAt, settings.calendar)}</span>
      </div>
    </div>
  );
}
