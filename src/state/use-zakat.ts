"use client";

import { useMemo } from "react";

import { metalPrices } from "@/data/nisab";
import { NISAB_BASIS } from "@/data/settings";
import { formatBalance } from "@/lib/format";
import { solPriceOf } from "@/lib/portfolio";
import type { Asset } from "@/lib/types";
import { breakdownByCategory, calculateZakat, nisabThreshold } from "@/lib/zakat";
import { usePortfolio } from "@/state/use-portfolio";

function describe(assets: Asset[]): string {
  if (assets.length === 1) {
    const [asset] = assets;
    return `${asset.symbol} ${formatBalance(asset.balance, asset.displayDecimals)}`;
  }

  return assets.map((asset) => asset.symbol).join(" · ");
}

/** The single source of truth for every number shown across the app. */
export function useZakat() {
  const { snapshot } = usePortfolio();

  return useMemo(() => {
    const result = calculateZakat({
      assets: snapshot.assets,
      dust: snapshot.dust,
      nisab: nisabThreshold(NISAB_BASIS, metalPrices),
      solPrice: solPriceOf(snapshot),
    });

    return { ...result, breakdown: breakdownByCategory(snapshot.assets, describe) };
  }, [snapshot]);
}
