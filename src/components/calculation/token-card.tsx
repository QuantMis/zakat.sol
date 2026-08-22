"use client";

import { TokenLogo } from "@/components/portfolio/token-logo";
import { Segmented } from "@/components/ui/segmented";
import { cn } from "@/lib/cn";
import { formatBalance, formatPrice, formatUsd } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { CATEGORY_LABELS, assetValue } from "@/lib/zakat";

const HELD_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

type TokenCardProps = {
  asset: Asset;
  /** The colour this holding carries in the breakdown charts, when it has one. */
  color?: string;
  held: boolean;
  onHeldChange: (held: boolean) => void;
};

/**
 * One holding, and the single question only its owner can answer: whether it
 * sat in the wallet for the whole lunar year. The chain can say what is held
 * now and what was held then, but not whether the same coins were there
 * throughout — so the figure is offered as an assumption that can be corrected
 * rather than asserted.
 *
 * Sized to sit four across a desktop row, which is what lets a long tail of
 * holdings be shown outright rather than folded away. The symbol leads and the
 * project name sits under it: at this width a name like "Marinade Staked SOL"
 * truncates to nothing useful, while a symbol almost never does.
 */
export function TokenCard({ asset, color, held, onHeldChange }: TokenCardProps) {
  const value = assetValue(asset);

  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-[12px] border p-3 transition-colors",
        held ? "border-line bg-white" : "border-line-soft bg-cream-soft",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <TokenLogo src={asset.icon} symbol={asset.symbol} />
        <span className="flex min-w-0 flex-col">
          <span className="flex min-w-0 items-center gap-1.5">
            {color ? (
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: color }}
              />
            ) : null}
            <span className="truncate text-[13px] leading-tight font-semibold">
              {asset.symbol}
            </span>
          </span>
          <span className="truncate text-[11px] text-faint">{asset.name}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1.5">
        <span
          className={cn(
            "tabular-nums text-[17px] leading-none font-semibold",
            !held && "text-faint line-through",
          )}
        >
          {formatUsd(value)}
        </span>
        <span className="rounded-full bg-mint px-2 py-0.5 text-[10.5px] font-semibold text-brand">
          {CATEGORY_LABELS[asset.category]}
        </span>
      </div>

      <dl className="flex flex-col gap-1 text-[11.5px]">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted">Balance</dt>
          <dd className="min-w-0 truncate tabular-nums">
            {formatBalance(asset.balance, asset.displayDecimals)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="shrink-0 text-muted">Price</dt>
          <dd className="min-w-0 truncate tabular-nums">{formatPrice(asset.price)}</dd>
        </div>
      </dl>

      {/* Pinned to the bottom so the control sits on one line across a row of
          cards whose names wrap to different heights. */}
      <div className="mt-auto flex items-center justify-between gap-2 border-t border-line-soft pt-2.5">
        <span className="shrink-0 text-[11px] text-muted">Held all hawl?</span>
        <Segmented
          size="sm"
          label={`Was ${asset.symbol} held through the whole hawl?`}
          options={HELD_OPTIONS}
          value={held ? "yes" : "no"}
          onChange={(next) => onHeldChange(next === "yes")}
          className="shrink-0 rounded-[9px] bg-cream p-0.5"
        />
      </div>
    </div>
  );
}
