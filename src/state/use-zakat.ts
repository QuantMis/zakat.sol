"use client";

import { useMemo } from "react";

import { settledYears } from "@/data/history";
import { metalPrices } from "@/data/nisab";
import { portfolio, solPrice } from "@/data/portfolio";
import { formatBalance } from "@/lib/format";
import { includesDust, partitionAssets } from "@/lib/selection";
import type { Asset, ZakatYear } from "@/lib/types";
import { breakdownByCategory, calculateZakat, nisabThreshold } from "@/lib/zakat";
import { useZakatSettings } from "@/state/zakat-settings";

function describe(assets: Asset[]): string {
  if (assets.length === 1) {
    const [asset] = assets;
    return `${asset.symbol} ${formatBalance(asset.balance, asset.displayDecimals)}`;
  }

  return assets.map((asset) => asset.symbol).join(" · ");
}

/** The single source of truth for every number shown across the app. */
export function useZakat() {
  const { settings } = useZakatSettings();

  return useMemo(() => {
    const { included, excluded } = partitionAssets(portfolio.assets, settings);
    const includeDust = includesDust(settings);
    const nisab = nisabThreshold(settings.nisabBasis, metalPrices);

    const result = calculateZakat({
      includedAssets: included,
      excludedAssets: excluded,
      dust: portfolio.dust,
      includeDust,
      liabilities: settings.liabilities,
      nisab,
      solPrice,
    });

    return {
      ...result,
      includedAssets: included,
      excludedAssets: excluded,
      includeDust,
      breakdown: breakdownByCategory(included, describe),
    };
  }, [settings]);
}

/** Settled years plus the year being calculated right now. */
export function useZakatHistory(): ZakatYear[] {
  const { netZakatable, zakatDue } = useZakat();

  return useMemo(() => {
    const current: ZakatYear = {
      id: "1448",
      hijriYear: "1448 AH",
      gregorianYear: "2026",
      calculatedAt: portfolio.scannedAt,
      netWealth: netZakatable,
      zakat: zakatDue,
      status: "due",
    };

    return [current, ...settledYears];
  }, [netZakatable, zakatDue]);
}
