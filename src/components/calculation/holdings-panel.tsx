"use client";

import { TokenCard } from "@/components/calculation/token-card";
import { Panel } from "@/components/ui/panel";
import { SolanaMark } from "@/components/ui/solana-mark";
import { formatUsd } from "@/lib/format";
import type { Asset } from "@/lib/types";
import { assetValue, sumAssets } from "@/lib/zakat";

type HoldingsPanelProps = {
  address: string;
  /** SNS name when the wallet has one — a name reads better than base58. */
  domain?: string;
  holdings: Asset[];
  colourOf: (mint: string) => string | undefined;
  heldOf: (mint: string) => boolean;
  onHeldChange: (mint: string, held: boolean) => void;
};

/**
 * Everything the wallet held at this hawl, shown outright. The holdings used to
 * sit behind a per-wallet disclosure, which cost a click on every visit to hide
 * the one thing the panel exists to show; the wallet it belongs to is named on
 * the chain row instead. Four compact cards to a desktop row is what makes that
 * affordable — a long tail runs to a handful of rows rather than a wall.
 */
export function HoldingsPanel({
  address,
  domain,
  holdings,
  colourOf,
  heldOf,
  onHeldChange,
}: HoldingsPanelProps) {
  const gross = sumAssets(holdings);
  const counted = sumAssets(holdings.filter((asset) => heldOf(asset.mint)));
  const excluded = holdings.length - holdings.filter((asset) => heldOf(asset.mint)).length;

  return (
    <Panel className="flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px]">Total asset value</h2>
          <p className="text-[12.5px] text-muted">
            {holdings.length} {holdings.length === 1 ? "holding" : "holdings"} at this hawl
          </p>
        </div>

        <div className="flex flex-col items-start gap-0.5 sm:items-end">
          {/* Proportional figures: equal-width digits make a headline number
              read loose at this size. */}
          <span className="text-[28px] leading-none font-semibold tracking-[-0.02em]">
            {formatUsd(gross)}
          </span>
          {excluded > 0 ? (
            <span className="text-[12px] text-muted">
              {formatUsd(counted)} counted · {excluded} set aside
            </span>
          ) : null}
        </div>
      </div>

      {/* The chain, and the wallet read on it. The address is carried in full
          so it can be checked against an explorer without hunting for it. */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-t border-line-soft px-5 py-3.5">
        <SolanaMark className="size-4" />
        <span className="text-[13px] font-semibold">Solana</span>
        {domain ? <span className="text-[12.5px] text-brand">{domain}</span> : null}
        <span className="min-w-0 basis-full truncate font-mono text-[11.5px] text-faint sm:flex-1 sm:basis-auto sm:text-right">
          {address}
        </span>
      </div>

      <div className="grid gap-3 px-5 pt-4 pb-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {[...holdings]
          .sort((left, right) => assetValue(right) - assetValue(left))
          .map((asset) => (
            <TokenCard
              key={asset.mint}
              asset={asset}
              color={colourOf(asset.mint)}
              held={heldOf(asset.mint)}
              onHeldChange={(held) => onHeldChange(asset.mint, held)}
            />
          ))}
      </div>
    </Panel>
  );
}
