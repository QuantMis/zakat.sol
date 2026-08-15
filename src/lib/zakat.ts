import type { Asset, DustBucket, Liability, MetalPrices, NisabBasis } from "@/lib/types";

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
  includedAssets: Asset[];
  excludedAssets: Asset[];
  dust: DustBucket;
  includeDust: boolean;
  liabilities: Liability[];
  nisab: number;
  solPrice: number;
};

export type ZakatResult = {
  /** Everything the scan found, before exclusions and debts. */
  grossHoldings: number;
  excludedValue: number;
  liabilitiesTotal: number;
  deductions: number;
  netZakatable: number;
  nisab: number;
  aboveNisab: boolean;
  zakatDue: number;
  zakatDueInSol: number;
};

export function calculateZakat({
  includedAssets,
  excludedAssets,
  dust,
  includeDust,
  liabilities,
  nisab,
  solPrice,
}: ZakatInput): ZakatResult {
  const dustValue = includeDust ? dust.value : 0;
  const grossHoldings = round2(sumAssets(includedAssets) + sumAssets(excludedAssets) + dust.value);

  const excludedValue = round2(sumAssets(excludedAssets) + (includeDust ? 0 : dust.value));
  const liabilitiesTotal = round2(
    liabilities.reduce((total, liability) => total + liability.amount, 0),
  );
  const deductions = round2(excludedValue + liabilitiesTotal);

  const netZakatable = round2(Math.max(0, sumAssets(includedAssets) + dustValue - liabilitiesTotal));
  const aboveNisab = netZakatable >= nisab;
  const zakatDue = aboveNisab ? round2(netZakatable * ZAKAT_RATE) : 0;

  return {
    grossHoldings,
    excludedValue,
    liabilitiesTotal,
    deductions,
    netZakatable,
    nisab,
    aboveNisab,
    zakatDue,
    zakatDueInSol: solPrice > 0 ? zakatDue / solPrice : 0,
  };
}

export type BreakdownLine = {
  label: string;
  detail: string;
  value: number;
};

const CATEGORY_LABELS: Record<Asset["category"], string> = {
  sol: "SOL",
  stablecoin: "Stablecoins",
  governance: "Governance tokens",
  memecoin: "Memecoins",
};

const CATEGORY_ORDER: Asset["category"][] = ["sol", "stablecoin", "governance", "memecoin"];

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
