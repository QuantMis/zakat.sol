"use client";

import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/cn";
import { formatBalance, formatPrice, formatUsd } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { assetValue } from "@/lib/zakat";

import { rowGrid } from "./grid";

type AssetRowProps = {
  asset: Asset;
  included: boolean;
  /** True when a treatment rule — not the owner — took this holding out. */
  lockedByRule: boolean;
  onToggle: () => void;
};

export function AssetRow({ asset, included, lockedByRule, onToggle }: AssetRowProps) {
  const balance = formatBalance(asset.balance, asset.displayDecimals);

  return (
    <div
      className={cn(
        rowGrid,
        "border-b border-line-soft px-5 py-3.5 transition-opacity",
        !included && "opacity-60",
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-mint text-[10px] font-bold text-muted">
          {asset.symbol.slice(0, 4)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14.5px] font-medium">{asset.name}</span>
          <span className="font-mono text-[11px] text-faint">
            <span className="md:hidden">{balance} </span>
            {asset.symbol}
          </span>
        </span>
      </div>

      <div className="hidden text-right font-mono text-[13.5px] text-ink-soft md:block">
        {balance}
      </div>
      <div className="hidden text-right font-mono text-[13.5px] text-muted md:block">
        {formatPrice(asset.price)}
      </div>
      <div className="text-right font-mono text-[14.5px] font-medium">
        {formatUsd(assetValue(asset))}
      </div>

      <div className="flex justify-end">
        <Toggle
          checked={included}
          onChange={onToggle}
          disabled={lockedByRule}
          title={lockedByRule ? "Excluded by a treatment rule" : undefined}
          label={`Include ${asset.name} in the calculation`}
        />
      </div>
    </div>
  );
}
