"use client";

import { useState } from "react";

import { AssetRow } from "@/components/portfolio/asset-row";
import { DustRow } from "@/components/portfolio/dust-row";
import { rowGrid } from "@/components/portfolio/grid";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { Segmented } from "@/components/ui/segmented";
import { detectedMintCount, portfolio } from "@/data/portfolio";
import { isAssetIncluded } from "@/lib/selection";
import { useZakat } from "@/state/use-zakat";
import { useZakatSettings } from "@/state/zakat-settings";

const filters = [
  { value: "all", label: "All" },
  { value: "included", label: "Included" },
  { value: "excluded", label: "Excluded" },
] as const;

type Filter = (typeof filters)[number]["value"];

export function AssetTable() {
  const { settings, setRule, toggleAsset } = useZakatSettings();
  const { includedAssets, includeDust } = useZakat();
  const [filter, setFilter] = useState<Filter>("all");

  const includedMints = new Set(includedAssets.map((asset) => asset.mint));
  const visibleAssets = portfolio.assets.filter((asset) => {
    if (filter === "included") return includedMints.has(asset.mint);
    if (filter === "excluded") return !includedMints.has(asset.mint);
    return true;
  });

  const showDust = filter === "all" || (filter === "included") === includeDust;

  return (
    <Panel className="flex flex-1 flex-col">
      <PanelHeader className="flex-wrap">
        <div className="flex items-center gap-2.5">
          <h2 className="text-[15px]">Detected assets</h2>
          <span className="font-mono text-xs text-muted-soft">
            {portfolio.assets.length} of {detectedMintCount} priced
          </span>
        </div>

        <Segmented options={filters} value={filter} onChange={setFilter} label="Filter assets" />
      </PanelHeader>

      <div
        className={`${rowGrid} border-b border-line-soft px-5 py-3 font-mono text-[11px] tracking-[0.1em] text-faint uppercase`}
      >
        <div>Asset</div>
        <div className="hidden text-right md:block">Balance</div>
        <div className="hidden text-right md:block">Price</div>
        <div className="text-right">Value</div>
        <div className="text-right">Include</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {visibleAssets.map((asset) => (
          <AssetRow
            key={asset.mint}
            asset={asset}
            included={includedMints.has(asset.mint)}
            lockedByRule={!isAssetIncluded(asset, { ...settings, excludedMints: [] })}
            onToggle={() => toggleAsset(asset.mint)}
          />
        ))}

        {showDust ? (
          <DustRow
            included={includeDust}
            onToggle={() => setRule("ignoreDust", includeDust)}
          />
        ) : null}

        {visibleAssets.length === 0 && !showDust ? (
          <p className="px-5 py-10 text-center text-sm text-muted">Nothing in this view.</p>
        ) : null}
      </div>
    </Panel>
  );
}
