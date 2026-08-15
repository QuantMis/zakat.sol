"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/cn";
import { portfolio } from "@/data/portfolio";
import { formatUsd } from "@/lib/format";

import { rowGrid } from "./grid";

type DustRowProps = {
  included: boolean;
  onToggle: () => void;
};

export function DustRow({ included, onToggle }: DustRowProps) {
  const { dust } = portfolio;

  return (
    <div className={cn(rowGrid, "px-5 py-3.5 transition-opacity", !included && "opacity-45")}>
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-mint text-[10px] font-bold text-muted">
          {dust.mintCount}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14.5px] font-medium">Dust &amp; unpriced tokens</span>
          <span className="font-mono text-[11px] text-faint">{dust.mintCount} mints</span>
        </span>
      </div>

      <div className="hidden text-right font-mono text-[13.5px] text-ink-soft md:block">—</div>
      <div className="hidden text-right font-mono text-[13.5px] text-muted md:block">—</div>
      <div className="text-right font-mono text-[14.5px] font-medium">{formatUsd(dust.value)}</div>

      <div className="flex justify-end">
        <Toggle checked={included} onChange={onToggle} label="Include dust and unpriced tokens" />
      </div>
    </div>
  );
}
