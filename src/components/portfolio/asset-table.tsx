"use client";

import { useRef, useState } from "react";

import { AssetRow } from "@/components/portfolio/asset-row";
import { DustRow } from "@/components/portfolio/dust-row";
import { rowGrid } from "@/components/portfolio/grid";
import { AssetTableSkeleton } from "@/components/portfolio/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { detectedMintCount } from "@/lib/portfolio";
import { usePortfolio } from "@/state/use-portfolio";

/** Rows per page — enough to fill the panel on a laptop without scrolling it. */
const PAGE_SIZE = 10;

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
      <p className="text-[15px] font-medium">{title}</p>
      <p className="max-w-[360px] text-[13.5px] leading-relaxed text-muted">{detail}</p>
    </div>
  );
}

export function AssetTable() {
  const { status, snapshot, error } = usePortfolio();
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState(snapshot.address);
  const rows = useRef<HTMLDivElement>(null);

  // A different wallet is a different list, and page 3 of the last one means
  // nothing here. Adjusting during render rather than in an effect keeps the
  // rows below from painting once at the old page first.
  if (paging !== snapshot.address) {
    setPaging(snapshot.address);
    setPage(1);
  }

  const assets = snapshot.assets;
  const pageCount = Math.max(1, Math.ceil(assets.length / PAGE_SIZE));

  // Clamped in case the same address is re-scanned into a shorter list.
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = assets.slice(start, start + PAGE_SIZE);

  const turnTo = (next: number) => {
    setPage(next);
    rows.current?.scrollTo({ top: 0 });
  };

  return (
    <Panel className="flex flex-1 flex-col">
      <PanelHeader className="flex-wrap">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px]">Detected assets</h2>
          {status === "scanned" ? (
            <span className="text-xs text-muted-soft">
              {assets.length} of {detectedMintCount(snapshot)} priced
            </span>
          ) : null}
        </div>
      </PanelHeader>

      <div
        className={`${rowGrid} border-b border-line-soft px-5 py-3 text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Asset</div>
        <div className="hidden text-right md:block">Balance</div>
        <div className="hidden text-right md:block">Price</div>
        <div className="text-right">Value</div>
      </div>

      <div ref={rows} className="flex-1 overflow-y-auto">
        {status === "scanning" ? <AssetTableSkeleton /> : null}

        {status === "idle" ? (
          <EmptyState
            title="Nothing scanned yet"
            detail="Connect a wallet, or paste an address on the home page to report on any wallet."
          />
        ) : null}

        {status === "failed" ? (
          <EmptyState title="That scan did not complete" detail={error ?? ""} />
        ) : null}

        {status === "scanned" ? (
          <>
            {visible.map((asset) => (
              <AssetRow key={asset.mint} asset={asset} />
            ))}

            {/* The tail of the list, so it belongs at the end of the last page
                rather than repeated under every ten rows. */}
            {current === pageCount ? <DustRow /> : null}

            {assets.length === 0 ? (
              <EmptyState
                title="Nothing priced in this wallet"
                detail="Every mint it holds is unverified or has not traded recently."
              />
            ) : null}
          </>
        ) : null}
      </div>

      {status === "scanned" ? (
        <Pagination
          page={current}
          pageSize={PAGE_SIZE}
          total={assets.length}
          onChange={turnTo}
          label="assets"
        />
      ) : null}
    </Panel>
  );
}
