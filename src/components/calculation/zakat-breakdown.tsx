"use client";

import { useState } from "react";

import { assetRowGrid } from "@/components/calculation/zakat-grid";
import { TokenLogo } from "@/components/portfolio/token-logo";
import { CalculatorIcon } from "@/components/ui/calculator-icon";
import { Donut } from "@/components/ui/donut";
import { Pagination } from "@/components/ui/pagination";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/cn";
import type { Slice } from "@/lib/composition";
import { formatBalance, formatCompactUsd, formatLocal, formatUsd } from "@/lib/format";
import type { Asset, ZakatYear } from "@/lib/types";
import { ZAKAT_RATE, assetValue, nisabBasisLabel } from "@/lib/zakat";

/** Enough rows to read the shape of a wallet without burying the totals. */
const ASSETS_PER_PAGE = 12;

function Standing({ counted }: { counted: boolean }) {
  return (
    <span
      className={cn(
        "w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold",
        counted ? "bg-brand/12 text-brand" : "bg-ink/[0.06] text-muted",
      )}
    >
      {counted ? "Zakatable" : "Set aside"}
    </span>
  );
}

function AssetRow({ asset, counted }: { asset: Asset; counted: boolean }) {
  const balance = formatBalance(asset.balance, asset.displayDecimals);

  return (
    <div className={`${assetRowGrid} border-b border-line-soft px-5 py-3.5`}>
      <div className="flex min-w-0 items-center gap-3">
        <TokenLogo src={asset.icon} symbol={asset.symbol} />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] font-medium">{asset.name}</span>
          <span className="text-[11px] text-faint">
            <span className="md:hidden">{balance} </span>
            {asset.symbol}
          </span>
        </span>
      </div>

      <div className="hidden text-right tabular-nums text-[13.5px] text-ink-soft md:block">
        {balance}
      </div>
      <div className="hidden md:block">
        <Standing counted={counted} />
      </div>
      <div
        className={cn(
          "text-right tabular-nums text-[14px] font-medium",
          !counted && "text-faint line-through",
        )}
      >
        {formatUsd(assetValue(asset))}
      </div>
    </div>
  );
}

function Figure({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: "brand";
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12.5px] text-muted">{label}</span>
      <span className="flex flex-wrap items-baseline gap-2">
        <span
          className={cn(
            "text-[22px] leading-none font-semibold tracking-[-0.02em]",
            tone === "brand" && "text-brand",
          )}
        >
          {value}
        </span>
        {detail ? <span className="text-[13px] text-muted">{detail}</span> : null}
      </span>
    </div>
  );
}

type ZakatBreakdownProps = {
  year: ZakatYear;
  holdings: Asset[];
  heldOf: (mint: string) => boolean;
  /** Base and due after the hawl answers have been applied. */
  netZakatable: number;
  zakatDue: number;
  aboveNisab: boolean;
  byToken: Slice[];
  byCategory: Slice[];
};

/**
 * What the holdings come to, how that total is composed, and the threshold it
 * was measured against. The rings are a glance; the table under them is the
 * reading — every figure in a wedge is repeated there in full, so nothing on
 * this panel depends on telling two colours apart.
 */
export function ZakatBreakdown({
  year,
  holdings,
  heldOf,
  netZakatable,
  zakatDue,
  aboveNisab,
  byToken,
  byCategory,
}: ZakatBreakdownProps) {
  const [page, setPage] = useState(1);

  const rows = [...holdings].sort((left, right) => assetValue(right) - assetValue(left));

  // A wallet with sixty mints would otherwise run the totals off the bottom of
  // the page, and the totals are the part worth reaching.
  const pageCount = Math.max(1, Math.ceil(rows.length / ASSETS_PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * ASSETS_PER_PAGE, current * ASSETS_PER_PAGE);

  return (
    <Panel className="flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-mint text-brand">
          <CalculatorIcon className="size-5" />
        </span>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[15px]">Digital asset zakat</h2>
          <p className="text-[12.5px] text-muted">What this wallet owes for the year</p>
        </div>
      </div>

      <div className="mx-5 mb-5 flex flex-col gap-5 rounded-[12px] bg-cream px-5 py-4 sm:flex-row sm:gap-10">
        <Figure label="Net zakatable" value={formatUsd(netZakatable)} />
        <Figure
          label={aboveNisab ? "Zakat due" : "Below nisab — nothing due"}
          value={formatLocal(zakatDue)}
          detail={`(${formatUsd(zakatDue)})`}
          tone="brand"
        />
      </div>

      <div className="flex flex-col gap-8 border-t border-line-soft px-5 py-6 lg:flex-row lg:gap-12">
        {/* Compact in the hole: a ring 120px across cannot hold a figure to the
            cent, and the exact total is directly below in the table anyway. */}
        <Donut
          title="By token"
          slices={byToken}
          total={netZakatable}
          centreLabel={formatCompactUsd(netZakatable)}
        />
        <Donut
          title="By treatment"
          slices={byCategory}
          total={netZakatable}
          centreLabel={formatCompactUsd(netZakatable)}
        />
      </div>

      <div className="border-t border-line-soft px-5 py-4">
        <h3 className="text-[13.5px]">Asset details</h3>
      </div>

      <div
        className={`${assetRowGrid} border-y border-line-soft bg-cream-soft px-5 py-3 text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Asset</div>
        <div className="hidden text-right md:block">Balance</div>
        <div className="hidden md:block">Standing</div>
        <div className="text-right">Value</div>
      </div>

      {visible.map((asset) => (
        <AssetRow key={asset.mint} asset={asset} counted={heldOf(asset.mint)} />
      ))}

      <Pagination
        page={current}
        pageSize={ASSETS_PER_PAGE}
        total={rows.length}
        onChange={setPage}
        label="assets"
      />

      <div className={`${assetRowGrid} border-b border-t border-line-soft px-5 py-3.5`}>
        <span className="text-[14px] font-semibold">Net zakatable</span>
        <span className="hidden md:block" />
        <span className="hidden md:block" />
        <span className="text-right tabular-nums text-[14.5px] font-semibold">
          {formatUsd(netZakatable)}
        </span>
      </div>

      <div className={`${assetRowGrid} border-b border-line-soft px-5 py-3.5`}>
        <span className="text-[14px]">Nisab</span>
        <span className="hidden md:block" />
        <span className="hidden text-[11.5px] text-faint md:block">
          {nisabBasisLabel(year.nisabBasis)} · {aboveNisab ? "above" : "below"}
        </span>
        <span className="text-right tabular-nums text-[14px] text-muted">
          {formatUsd(year.nisab)}
        </span>
      </div>

      <div className={`${assetRowGrid} bg-[#F2F6F2] px-5 py-4 text-brand`}>
        <span className="text-[14.5px] font-semibold">Zakat due</span>
        <span className="hidden md:block" />
        <span className="hidden text-[11.5px] md:block">{ZAKAT_RATE * 100}% of net</span>
        <span className="text-right tabular-nums text-[15.5px] font-semibold">
          {formatUsd(zakatDue)}
        </span>
      </div>
    </Panel>
  );
}
