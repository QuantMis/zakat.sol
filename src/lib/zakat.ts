import type { Asset, BreakdownLine, DustBucket, MetalPrices, NisabBasis } from "@/lib/types";

/** Zakat is 2.5% of qualifying wealth held for a full lunar year (hawl). */
export const ZAKAT_RATE = 0.025;

/** Classical nisab thresholds, in grams of the respective metal. */
export const NISAB_GRAMS: Record<NisabBasis, number> = {
  gold: 85,
  silver: 595,
};

/** Holdings below this are treated as dust when the rule is enabled. */
export const DUST_THRESHOLD_USD = 5;

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function assetValue(asset: Asset): number {
  return asset.balance * asset.price;
}

export function sumAssets(assets: Asset[]): number {
  return assets.reduce((total, asset) => total + assetValue(asset), 0);
}

export function nisabBasisLabel(basis: NisabBasis): string {
  return `${basis} ${NISAB_GRAMS[basis]}g`;
}

export function nisabThreshold(basis: NisabBasis, prices: MetalPrices): number {
  const pricePerGram = basis === "gold" ? prices.goldPerGram : prices.silverPerGram;
  return round2(NISAB_GRAMS[basis] * pricePerGram);
}

export type ZakatInput = {
  assets: Asset[];
  dust: DustBucket;
  nisab: number;
  solPrice: number;
};

export type ZakatResult = {
  /** Everything the scan found, dust included. */
  grossHoldings: number;
  /** The dust the calculation leaves out — unpriced, or under the threshold. */
  excludedValue: number;
  netZakatable: number;
  nisab: number;
  aboveNisab: boolean;
  zakatDue: number;
  zakatDueInSol: number;
};

/**
 * Every priced holding counts. Dust does not: it is either unpriced, and so has
 * no honest value to add, or it is under the threshold and rounds to noise.
 */
export function calculateZakat({ assets, dust, nisab, solPrice }: ZakatInput): ZakatResult {
  const netZakatable = round2(sumAssets(assets));
  const aboveNisab = netZakatable >= nisab;
  const zakatDue = aboveNisab ? round2(netZakatable * ZAKAT_RATE) : 0;

  return {
    grossHoldings: round2(netZakatable + dust.value),
    excludedValue: round2(dust.value),
    netZakatable,
    nisab,
    aboveNisab,
    zakatDue,
    zakatDueInSol: solPrice > 0 ? zakatDue / solPrice : 0,
  };
}

export const CATEGORY_LABELS: Record<Asset["category"], string> = {
  // Named for what it contains rather than just "SOL": liquid staking tokens
  // are counted here too, so this line is reliably larger than the SOL holding
  // beside it in the by-token breakdown. Same name for both would read as an
  // arithmetic error rather than the two different things they are.
  sol: "SOL & staked SOL",
  stablecoin: "Stablecoins",
  governance: "Governance tokens",
  memecoin: "Memecoins",
};

/** Fixed, so a category keeps its colour on screen however the holdings move. */
export const CATEGORY_ORDER: Asset["category"][] = [
  "sol",
  "stablecoin",
  "governance",
  "memecoin",
];

/** Groups the included holdings into the rows shown on the calculation screen. */
export function breakdownByCategory(
  assets: Asset[],
  describe: (assets: Asset[]) => string,
): BreakdownLine[] {
  return CATEGORY_ORDER.flatMap((category) => {
    const matching = assets.filter((asset) => asset.category === category);
    if (matching.length === 0) return [];

    return [
      {
        label: CATEGORY_LABELS[category],
        detail: describe(matching),
        value: round2(sumAssets(matching)),
      },
    ];
  });
}
